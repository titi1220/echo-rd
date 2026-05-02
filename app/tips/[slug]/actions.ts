"use server";

import { tipSchema } from "@/lib/security";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";

export async function submitTip(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = tipSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "La pista necesita un mensaje valido y CAPTCHA." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Gracias. Tu pista fue recibida de forma privada para revision." };
  }

  const caseSlug = String(formData.get("case_slug") ?? "");
  const supabase = createServerSupabaseClient();
  const { data: relatedCase, error: caseError } = await supabase.from("cases").select("id").eq("slug", caseSlug).maybeSingle();

  if (caseError || !relatedCase) {
    return { ok: false, message: "No pudimos encontrar el caso relacionado." };
  }

  const data = parsed.data;
  const { error } = await supabase.from("tips").insert({
    case_id: relatedCase.id,
    message: data.message,
    sender_name: data.sender_name ?? "",
    sender_phone: data.sender_phone ?? "",
    whatsapp: data.whatsapp ?? "",
    reviewed: false
  });

  if (error) {
    return { ok: false, message: "No pudimos guardar la pista. Intenta nuevamente." };
  }

  return { ok: true, message: "Gracias. Tu pista fue recibida de forma privada para revision." };
}
