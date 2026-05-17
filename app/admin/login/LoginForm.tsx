"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Field, inputClass } from "@/components/FormElements";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage("No pudimos iniciar sesion. Verifica el correo y la contrasena.");
        return;
      }

      if (!data.user) {
        setMessage("No pudimos confirmar la cuenta. Verifica el correo y la contrasena.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos iniciar sesion en este momento.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <Field label="Correo electrónico">
        <input name="email" type="email" className={inputClass} required />
      </Field>
      <Field label="Contrasena">
        <input name="password" type="password" className={inputClass} required />
      </Field>
      {message && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-alert">{message}</p>}
      <button disabled={pending} className="rounded-xl bg-civic px-6 py-4 font-black text-white disabled:opacity-60">
        {pending ? "Entrando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
