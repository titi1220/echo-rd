import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { demoCases, demoSightings, resources as demoResources } from "@/lib/data";
import type { MissingCase, Sighting } from "@/lib/types";

function normalizeCase(item: Partial<MissingCase>): MissingCase {
  return {
    id: String(item.id ?? ""),
    slug: String(item.slug ?? ""),
    full_name: String(item.full_name ?? ""),
    nickname: item.nickname ?? "",
    age: Number(item.age ?? 0),
    gender: item.gender ?? "unknown",
    height: item.height ?? "",
    photo_url: item.photo_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    province: String(item.province ?? ""),
    municipality: String(item.municipality ?? ""),
    location_last_seen: String(item.location_last_seen ?? ""),
    date_last_seen: String(item.date_last_seen ?? ""),
    time_last_seen: String(item.time_last_seen ?? ""),
    clothing_description: item.clothing_description ?? "",
    physical_traits: item.physical_traits ?? "",
    circumstances: item.circumstances ?? "",
    contact_name: item.contact_name ?? "",
    contact_phone: item.contact_phone ?? "",
    whatsapp: item.whatsapp ?? "",
    email: item.email ?? "",
    police_report: Boolean(item.police_report),
    urgency_level: item.urgency_level ?? "standard",
    status: item.status ?? "pending",
    verified: Boolean(item.verified),
    demo: Boolean(item.demo ?? false),
    created_at: String(item.created_at ?? new Date().toISOString()),
    updated_at: String(item.updated_at ?? new Date().toISOString())
  };
}

export async function getPublicCases() {
  if (!hasSupabaseServerEnv()) {
    return demoCases.filter((item) => ["active", "urgent", "found_safe"].includes(item.status));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .in("status", ["active", "urgent", "found_safe"])
    .eq("verified", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoCases.filter((item) => ["active", "urgent", "found_safe"].includes(item.status));
  }

  return data.map((item) => normalizeCase({ ...item, demo: false }));
}

export async function getActiveCases() {
  const cases = await getPublicCases();
  return cases.filter((item) => ["active", "urgent"].includes(item.status));
}

export async function getFoundSafeCases() {
  const cases = await getPublicCases();
  return cases.filter((item) => item.status === "found_safe");
}

export async function getCaseBySlugFromSource(slug: string) {
  if (!hasSupabaseServerEnv()) {
    return demoCases.find((item) => item.slug === slug);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .in("status", ["active", "urgent", "found_safe"])
    .eq("verified", true)
    .maybeSingle();

  if (error || !data) {
    return demoCases.find((item) => item.slug === slug);
  }

  return normalizeCase({ ...data, demo: false });
}

export async function getAdminCases() {
  if (!hasSupabaseServerEnv()) {
    return demoCases;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
  if (error || !data) return demoCases;
  return data.map((item) => normalizeCase({ ...item, demo: false }));
}

export async function getAdminSightings() {
  if (!hasSupabaseServerEnv()) {
    return demoSightings;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("sightings").select("*").order("created_at", { ascending: false });
  if (error || !data) return demoSightings;
  return data as Sighting[];
}

export async function getAdminTipCount() {
  if (!hasSupabaseServerEnv()) {
    return 0;
  }

  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase.from("tips").select("id", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function getResources() {
  if (!hasSupabaseServerEnv()) {
    return demoResources;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("resources").select("*").order("title");
  if (error || !data) return demoResources;
  return data;
}

export function makeSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
