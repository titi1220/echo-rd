"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { getCurrentAdmin, roleCan } from "@/lib/supabase-auth";
import type { CaseStatus } from "@/lib/types";

const allowedStatuses: CaseStatus[] = ["active", "urgent", "found_safe", "archived", "rejected", "duplicate", "needs_more_info"];

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

  revalidatePath("/admin");
  revalidatePath("/cases");
  revalidatePath("/");
  return { ok: true, message: "Caso actualizado." };
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
