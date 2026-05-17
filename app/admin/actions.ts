"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { getCurrentAdmin, roleCan } from "@/lib/supabase-auth";
import type { CaseStatus } from "@/lib/types";
import { makeSlug } from "@/lib/supabase-data";
import { sanitizeText } from "@/lib/security";

const allowedStatuses: CaseStatus[] = ["active", "urgent", "found_safe", "archived", "rejected", "duplicate", "needs_more_info"];

function getText(formData: FormData, key: string) {
  return sanitizeText(String(formData.get(key) ?? ""));
}

function getOptionalText(formData: FormData, key: string) {
  return sanitizeText(String(formData.get(key) ?? ""));
}

function revalidateAdminCasePages(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/cases");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/cases/${slug}`);
  }
}

export async function createAdminCase(_: { ok: boolean; message: string }, formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin || !roleCan(admin.role, "approve")) {
    return { ok: false, message: "No tienes permiso para crear casos." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: false, message: "Conecta Supabase para crear casos reales." };
  }

  const fullName = getText(formData, "full_name");
  const age = Number(formData.get("age") ?? 0);
  const province = getText(formData, "province");
  const municipality = getText(formData, "municipality");
  const locationLastSeen = getText(formData, "location_last_seen");
  const dateLastSeen = String(formData.get("date_last_seen") ?? "");
  const timeLastSeen = String(formData.get("time_last_seen") ?? "");
  const contactName = getText(formData, "contact_name");
  const contactPhone = getText(formData, "contact_phone");
  const status = String(formData.get("status") ?? "active") as CaseStatus;

  if (!fullName || !province || !municipality || !locationLastSeen || !dateLastSeen || !contactName || !contactPhone) {
    return { ok: false, message: "Completa los campos requeridos." };
  }

  if (!Number.isFinite(age) || age < 0 || age > 120) {
    return { ok: false, message: "La edad debe estar entre 0 y 120." };
  }

  if (!["pending", "active", "urgent", "found_safe"].includes(status)) {
    return { ok: false, message: "Estado inicial no permitido." };
  }

  const supabase = createServerSupabaseClient();
  const slug = `${makeSlug(fullName)}-${Date.now().toString(36)}`;
  const photoUrl = getOptionalText(formData, "photo_url");
  const verified = ["active", "urgent", "found_safe"].includes(status);

  const { data, error } = await supabase
    .from("cases")
    .insert({
      slug,
      full_name: fullName,
      nickname: getOptionalText(formData, "nickname"),
      age,
      gender: String(formData.get("gender") ?? "unknown"),
      height: getOptionalText(formData, "height"),
      photo_url: photoUrl,
      province,
      municipality,
      location_last_seen: locationLastSeen,
      date_last_seen: dateLastSeen,
      time_last_seen: timeLastSeen || null,
      clothing_description: getOptionalText(formData, "clothing_description"),
      physical_traits: getOptionalText(formData, "physical_traits"),
      circumstances: getOptionalText(formData, "circumstances"),
      contact_name: contactName,
      contact_phone: contactPhone,
      whatsapp: getOptionalText(formData, "whatsapp"),
      email: getOptionalText(formData, "email"),
      police_report: formData.get("police_report") === "yes",
      urgency_level: String(formData.get("urgency_level") ?? "standard"),
      status,
      verified
    })
    .select("id,slug")
    .single();

  if (error || !data) {
    return { ok: false, message: "No se pudo crear el caso. Revisa la base de datos." };
  }

  await supabase.from("activity_logs").insert({
    admin_id: admin.id,
    action_type: "case_created",
    case_id: data.id,
    notes: `Caso creado desde el panel: ${fullName}`
  });

  revalidateAdminCasePages(data.slug);
  return { ok: true, message: "Caso creado correctamente." };
}

export async function updateCaseStatus(caseId: string, status: CaseStatus) {
  const admin = await getCurrentAdmin();
  if (!admin || !roleCan(admin.role, "approve")) {
    return { ok: false, message: "No tienes permiso para moderar casos." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Accion demo aplicada." };
  }

  if (!allowedStatuses.includes(status)) {
    return { ok: false, message: "Estado no permitido." };
  }

  const supabase = createServerSupabaseClient();
  const patch = {
    status,
    verified: ["active", "urgent", "found_safe"].includes(status),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("cases").update(patch).eq("id", caseId);
  if (error) return { ok: false, message: "No se pudo actualizar el caso." };

  await supabase.from("activity_logs").insert({
    admin_id: admin.id,
    action_type: `case_${status}`,
    case_id: caseId,
    notes: `Estado actualizado a ${status}`
  });

  revalidateAdminCasePages();
  return { ok: true, message: "Caso actualizado." };
}

export async function deleteCase(caseId: string) {
  const admin = await getCurrentAdmin();
  if (!admin || !roleCan(admin.role, "delete")) {
    return { ok: false, message: "Solo un super admin puede eliminar casos." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: false, message: "Conecta Supabase para eliminar casos reales." };
  }

  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("cases").select("full_name,slug").eq("id", caseId).maybeSingle();
  const { error } = await supabase.from("cases").delete().eq("id", caseId);
  if (error) {
    return { ok: false, message: "No se pudo eliminar el caso." };
  }

  await supabase.from("activity_logs").insert({
    admin_id: admin.id,
    action_type: "case_deleted",
    case_id: null,
    notes: `Caso eliminado: ${existing?.full_name ?? caseId}`
  });

  revalidateAdminCasePages(existing?.slug);
  return { ok: true, message: "Caso eliminado." };
}

export async function updateSightingStatus(sightingId: string, status: string) {
  const admin = await getCurrentAdmin();
  if (!admin || !roleCan(admin.role, "review_private")) {
    return { ok: false, message: "No tienes permiso para revisar reportes." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Accion demo aplicada." };
  }

  const allowed = ["reviewing", "credible", "false_lead", "forwarded", "archived"];
  if (!allowed.includes(status)) {
    return { ok: false, message: "Estado no permitido." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("sightings").update({ status }).eq("id", sightingId);
  if (error) return { ok: false, message: "No se pudo actualizar el reporte." };

  revalidatePath("/admin");
  return { ok: true, message: "Reporte actualizado." };
}
