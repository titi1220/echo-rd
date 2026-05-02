"use server";

import { caseSubmissionSchema } from "@/lib/security";
import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { makeSlug } from "@/lib/supabase-data";

export async function submitCase(_: { ok: boolean; message: string }, formData: FormData) {
  const payload = Object.fromEntries(formData.entries());
  const parsed = caseSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos requeridos y vuelve a intentar." };
  }

  if (!hasSupabaseServerEnv()) {
    return { ok: true, message: "Tu caso fue enviado para revision urgente." };
  }

  const data = parsed.data;
  const slug = `${makeSlug(data.full_name)}-${Date.now().toString(36)}`;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("cases").insert({
    slug,
    full_name: data.full_name,
    nickname: data.nickname ?? "",
    age: data.age,
    gender: data.gender,
    height: data.height,
    province: data.province,
    municipality: data.municipality,
    location_last_seen: data.location_last_seen,
    date_last_seen: data.date_last_seen,
    time_last_seen: data.time_last_seen,
    clothing_description: data.clothing_description,
    physical_traits: data.physical_traits,
    circumstances: data.circumstances,
    contact_name: data.contact_name,
    contact_phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    police_report: data.police_report === "yes",
    urgency_level: "standard",
    status: "pending",
    verified: false
  });

  if (error) {
    return { ok: false, message: "No pudimos guardar el caso. Intenta nuevamente o contacta a Echo RD." };
  }

  return { ok: true, message: "Tu caso fue enviado para revision urgente." };
}
