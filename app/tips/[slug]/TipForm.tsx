"use client";

import { useActionState } from "react";
import { submitTip } from "@/app/tips/[slug]/actions";
import { CaptchaNotice, Field, inputClass, textareaClass } from "@/components/FormElements";

export function TipForm({ caseSlug }: { caseSlug: string }) {
  const [state, formAction, pending] = useActionState(submitTip, { ok: false, message: "" });
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <input type="hidden" name="case_slug" value={caseSlug} />
      <Field label="Mensaje"><textarea name="message" className={textareaClass} required /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Nombre opcional"><input name="sender_name" className={inputClass} /></Field>
        <Field label="Telefono opcional"><input name="sender_phone" className={inputClass} /></Field>
        <Field label="WhatsApp opcional"><input name="whatsapp" className={inputClass} /></Field>
      </div>
      <Field label="Subir imagen o video opcional">
        <input name="media" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" className={inputClass} />
      </Field>
      <CaptchaNotice />
      {state.message && <p className={`rounded-xl p-4 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-alert"}`}>{state.message}</p>}
      <button disabled={pending} className="rounded-xl bg-civic px-6 py-4 font-black text-white disabled:opacity-60">{pending ? "Enviando..." : "Enviar pista privada"}</button>
    </form>
  );
}
