"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={logout} className="rounded-xl border border-white/30 px-4 py-2 text-sm font-black text-white" type="button">
      Salir
    </button>
  );
}
