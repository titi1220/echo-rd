import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { demoCases, demoSightings } from "@/lib/data";
import { hasSupabaseServerEnv } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function demoStats() {
  return {
    missing: demoCases.filter((item) => ["active", "urgent"].includes(item.status)).length,
    urgent: demoCases.filter((item) => item.status === "urgent").length,
    foundSafe: demoCases.filter((item) => item.status === "found_safe").length,
    pending: demoCases.filter((item) => item.status === "pending").length,
    sightings: demoSightings.length,
    source: "demo",
    updatedAt: new Date().toISOString()
  };
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseServerEnv() || !supabaseUrl || !serviceKey) {
    return NextResponse.json(demoStats());
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const [missing, urgent, foundSafe, pending, sightings] = await Promise.all([
    supabase.from("cases").select("id", { count: "exact", head: true }).in("status", ["active", "urgent"]),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("status", "urgent"),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("status", "found_safe"),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("sightings").select("id", { count: "exact", head: true })
  ]);

  const hasError = [missing, urgent, foundSafe, pending, sightings].some((result) => result.error);
  if (hasError) {
    return NextResponse.json(demoStats(), { status: 200 });
  }

  return NextResponse.json({
    missing: missing.count ?? 0,
    urgent: urgent.count ?? 0,
    foundSafe: foundSafe.count ?? 0,
    pending: pending.count ?? 0,
    sightings: sightings.count ?? 0,
    source: "supabase",
    updatedAt: new Date().toISOString()
  });
}
