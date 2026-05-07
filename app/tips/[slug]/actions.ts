"use server";

import { tipSchema, verifyCaptcha } from "@/lib/security";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { uploadPrivateOrPublicFile } from "@/lib/storage";

export async function submitTip(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = tipSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "La pista necesita un mensaje valido y CAPTCHA." };
  }

  const captchaOk = await verifyCaptcha(parsed.data.captcha_token);
  if (!captchaOk) {
    return { ok: false, message: "No pudimos verificar el CAPTCHA." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Gracias. Tu pista fue recibida de forma privada para revisión." };
  }

  const caseSlug = String(formData.get("case_slug") ?? "");
  const supabase = createServerSupabaseClient();
  const { data: relatedCase, error: caseError } = await supabase.from("cases").select("id").eq("slug", caseSlug).maybeSingle();

  if (caseError || !relatedCase) {
    return { ok: false, message: "No pudimos encontrar el caso relacionado." };
  }

  const data = parsed.data;
  let mediaUrl = "";
  try {
    mediaUrl = await uploadPrivateOrPublicFile({
      bucket: "tip-media",
      file: formData.get("media") as File | null,
      folder: relatedCase.id,
      mode: "media",
      isPublic: false
    });
  } catch {
    return { ok: false, message: "El archivo debe ser imagen/video permitido y pesar menos de 25 MB." };
  }

  const { error } = await supabase.from("tips").insert({
    case_id: relatedCase.id,
    message: data.message,
    sender_name: data.sender_name ?? "",
    sender_phone: data.sender_phone ?? "",
    whatsapp: data.whatsapp ?? "",
    media_url: mediaUrl,
    reviewed: false
  });

  if (error) {
    return { ok: false, message: "No pudimos guardar la pista. Intenta nuevamente." };
  }

  return { ok: true, message: "Gracias. Tu pista fue recibida de forma privada para revisión." };
}
