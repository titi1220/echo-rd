"use server";

import { sightingSchema } from "@/lib/security";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";

export async function submitSighting(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = sightingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del reporte y vuelve a intentar." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Reporte recibido. Permanecera privado hasta ser revisado." };
  }

  const caseSlug = String(formData.get("case_slug") ?? "");
  const supabase = createServerSupabaseClient();
  const { data: relatedCase, error: caseError } = await supabase.from("cases").select("id").eq("slug", caseSlug).maybeSingle();

  if (caseError || !relatedCase) {
    return { ok: false, message: "No pudimos encontrar el caso relacionado." };
  }

  const data = parsed.data;
  const { error } = await supabase.from("sightings").insert({
    case_id: relatedCase.id,
    location_text: data.location_text,
    province: data.province,
    date_seen: data.date_seen,
    time_seen: data.time_seen,
    description: data.description,
    external_link: data.external_link ?? "",
    maps_link: data.maps_link ?? "",
    sender_name: data.sender_name ?? "",
    sender_phone: data.sender_phone ?? "",
    whatsapp: data.whatsapp ?? "",
    anonymous: data.anonymous === "on",
    priority: "medium",
    status: "new"
  });

  if (error) {
    return { ok: false, message: "No pudimos guardar el reporte. Intenta nuevamente." };
  }

  return { ok: true, message: "Reporte recibido. Permanecera privado hasta ser revisado." };
}
