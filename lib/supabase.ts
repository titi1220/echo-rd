import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hasRealEnvValue(value: string | undefined) {
  return Boolean(value && !value.includes("PASTE_") && !value.includes("_HERE"));
}

function hasValidSupabaseUrl() {
  if (!hasRealEnvValue(supabaseUrl)) return false;

  try {
    const url = new URL(supabaseUrl as string);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function hasSupabasePublicEnv() {
  return hasValidSupabaseUrl() && hasRealEnvValue(supabaseAnonKey);
}

export function hasSupabaseServerEnv() {
  return hasValidSupabaseUrl() && hasRealEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createBrowserSupabaseClient() {
  if (!hasSupabasePublicEnv() || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function createServerSupabaseClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
}
