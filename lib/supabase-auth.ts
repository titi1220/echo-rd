import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createServerSupabaseClient, hasSupabasePublicEnv, hasSupabaseServerEnv } from "@/lib/supabase";
import type { AdminRole } from "@/lib/types";

export async function createCookieSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always set cookies. Middleware/server actions handle writes.
        }
      }
    }
  });
}

export async function getCurrentAdmin() {
  if (!hasSupabasePublicEnv() || !hasSupabaseServerEnv()) {
    return process.env.NODE_ENV !== "production"
      ? { id: "demo-admin", email: "demo@echord.local", role: "super_admin" as AdminRole }
      : null;
  }

  const authClient = await createCookieSupabaseClient();
  if (!authClient) return null;

  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData.user) return null;

  const serviceClient = createServerSupabaseClient();
  const { data: admin, error: adminError } = await serviceClient
    .from("admins")
    .select("id,email,role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (adminError || !admin) return null;
  return admin as { id: string; email: string; role: AdminRole };
}

export function roleCan(role: AdminRole, action: "approve" | "edit" | "delete" | "manage_admins" | "review_private") {
  const permissions: Record<AdminRole, string[]> = {
    super_admin: ["approve", "edit", "delete", "manage_admins", "review_private"],
    moderator: ["approve", "edit", "review_private"],
    editor: ["edit"]
  };

  return permissions[role].includes(action);
}
