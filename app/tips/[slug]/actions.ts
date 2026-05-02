"use server";

import { tipSchema } from "@/lib/security";

export async function submitTip(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = tipSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "La pista necesita un mensaje valido y CAPTCHA." };
  }

  // Production: upload private media to Supabase Storage and insert into `tips`.
  return { ok: true, message: "Gracias. Tu pista fue recibida de forma privada para revision." };
}
