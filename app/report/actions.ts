"use server";

import { caseSubmissionSchema } from "@/lib/security";

export async function submitCase(_: { ok: boolean; message: string }, formData: FormData) {
  const payload = Object.fromEntries(formData.entries());
  const parsed = caseSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos requeridos y vuelve a intentar." };
  }

  // Production: upload photo to Supabase Storage, insert into `cases` with status `pending`,
  // run duplicate detection, and notify moderators.
  return { ok: true, message: "Tu caso fue enviado para revision urgente." };
}
