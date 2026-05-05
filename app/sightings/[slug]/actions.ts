"use server";

import { sightingSchema, verifyCaptcha } from "@/lib/security";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { uploadPrivateOrPublicFile } from "@/lib/storage";

export async function submitSighting(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = sightingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del reporte y vuelve a intentar." };
  }

  const captchaOk = await verifyCaptcha(parsed.data.captcha_token);
  if (!captchaOk) {
    return { ok: false, message: "No pudimos verificar el CAPTCHA." };
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
  let imageUrl = "";
  let videoUrl = "";
  try {
    imageUrl = await uploadPrivateOrPublicFile({
      bucket: "sighting-media",
      file: formData.get("image") as File | null,
      folder: relatedCase.id,
      mode: "image",
      isPublic: false
    });
    videoUrl = await uploadPrivateOrPublicFile({
      bucket: "sighting-media",
      file: formData.get("video") as File | null,
      folder: relatedCase.id,
      mode: "media",
      isPublic: false
    });
  } catch {
    return { ok: false, message: "Los archivos deben ser imagen/video permitidos y pesar menos de 25 MB." };
  }

  const { error } = await supabase.from("sightings").insert({
    case_id: relatedCase.id,
    location_text: data.location_text,
    province: data.province,
    date_seen: data.date_seen,
    time_seen: data.time_seen,
    description: data.description,
    image_url: imageUrl,
    video_url: videoUrl,
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
