"use client";

import { useActionState } from "react";
import { submitSighting } from "@/app/sightings/[slug]/actions";
import { CaptchaNotice, Field, inputClass, ProvinceSelect, textareaClass } from "@/components/FormElements";

export function SightingForm() {
  const [state, formAction, pending] = useActionState(submitSighting, { ok: false, message: "" });
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <Field label="Lugar donde fue vista la persona"><input name="location_text" className={inputClass} required /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Provincia"><ProvinceSelect /></Field>
        <Field label="Fecha en que fue vista"><input name="date_seen" type="date" className={inputClass} required /></Field>
        <Field label="Hora aproximada"><input name="time_seen" type="time" className={inputClass} required /></Field>
      </div>
      <Field label="Descripcion"><textarea name="description" className={textareaClass} required /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Subir imagen"><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} /></Field>
        <Field label="Subir video"><input name="video" type="file" accept="video/mp4,video/quicktime,video/webm" className={inputClass} /></Field>
        <Field label="Enlace externo"><input name="external_link" type="url" className={inputClass} /></Field>
        <Field label="Enlace de Google Maps"><input name="maps_link" type="url" className={inputClass} /></Field>
        <Field label="Nombre opcional"><input name="sender_name" className={inputClass} /></Field>
        <Field label="Telefono opcional"><input name="sender_phone" className={inputClass} /></Field>
        <Field label="WhatsApp opcional"><input name="whatsapp" className={inputClass} /></Field>
      </div>
      <label className="flex gap-3 text-sm font-semibold text-slate-700">
        <input type="checkbox" name="anonymous" className="mt-1 h-4 w-4" /> Enviar anonimamente
      </label>
      <CaptchaNotice />
      {state.message && <p className={`rounded-xl p-4 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-alert"}`}>{state.message}</p>}
      <button disabled={pending} className="rounded-xl bg-alert px-6 py-4 font-black text-white disabled:opacity-60">{pending ? "Enviando..." : "Enviar reporte privado"}</button>
    </form>
  );
}
