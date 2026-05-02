"use server";

import { sightingSchema } from "@/lib/security";

export async function submitSighting(_: { ok: boolean; message: string }, formData: FormData) {
  const parsed = sightingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del reporte y vuelve a intentar." };
  }

  // Production: private storage for uploads, insert into `sightings` with status `new`.
  return { ok: true, message: "Reporte recibido. Permanecera privado hasta ser revisado." };
}
