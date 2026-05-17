"use client";

import { useActionState } from "react";
import { createAdminCase } from "@/app/admin/actions";
import { Field, inputClass, ProvinceSelect, textareaClass } from "@/components/FormElements";

export function AdminCaseForm() {
  const [state, formAction, pending] = useActionState(createAdminCase, { ok: false, message: "" });

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre completo"><input name="full_name" className={inputClass} required /></Field>
        <Field label="Apodo"><input name="nickname" className={inputClass} /></Field>
        <Field label="Edad"><input name="age" type="number" min="0" max="120" className={inputClass} required /></Field>
        <Field label="Género">
          <select name="gender" className={inputClass} defaultValue="unknown">
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="non_binary">No binario</option>
            <option value="unknown">No especificado</option>
          </select>
        </Field>
        <Field label="Estatura"><input name="height" className={inputClass} placeholder="Ej. 5'7&quot;" /></Field>
        <Field label="Foto URL"><input name="photo_url" type="url" className={inputClass} placeholder="https://..." /></Field>
        <Field label="Provincia"><ProvinceSelect /></Field>
        <Field label="Municipio"><input name="municipality" className={inputClass} required /></Field>
        <Field label="Lugar donde fue visto por última vez"><input name="location_last_seen" className={inputClass} required /></Field>
        <Field label="Fecha"><input name="date_last_seen" type="date" className={inputClass} required /></Field>
        <Field label="Hora"><input name="time_last_seen" type="time" className={inputClass} /></Field>
        <Field label="Estado inicial">
          <select name="status" className={inputClass} defaultValue="active">
            <option value="pending">Pendiente</option>
            <option value="active">Activo</option>
            <option value="urgent">Urgente</option>
            <option value="found_safe">Localizado</option>
          </select>
        </Field>
        <Field label="Prioridad">
          <select name="urgency_level" className={inputClass} defaultValue="standard">
            <option value="standard">Normal</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </Field>
        <Field label="Denuncia policial">
          <select name="police_report" className={inputClass} defaultValue="no">
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Contacto"><input name="contact_name" className={inputClass} required /></Field>
        <Field label="Teléfono"><input name="contact_phone" className={inputClass} required /></Field>
        <Field label="WhatsApp"><input name="whatsapp" className={inputClass} /></Field>
        <Field label="Correo"><input name="email" type="email" className={inputClass} /></Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Vestimenta"><textarea name="clothing_description" className={textareaClass} /></Field>
        <Field label="Rasgos físicos"><textarea name="physical_traits" className={textareaClass} /></Field>
        <Field label="Circunstancias"><textarea name="circumstances" className={textareaClass} /></Field>
      </div>

      {state.message && (
        <p className={`rounded-xl p-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-alert"}`}>
          {state.message}
        </p>
      )}

      <button disabled={pending} className="rounded-xl bg-civic px-6 py-4 font-black text-white disabled:opacity-60">
        {pending ? "Creando..." : "Agregar caso"}
      </button>
    </form>
  );
}
