"use client";

import { useActionState } from "react";
import { submitCase } from "@/app/report/actions";
import { CaptchaNotice, Field, inputClass, ProvinceSelect, textareaClass } from "@/components/FormElements";

const steps = ["Persona", "Ultima vez", "Foto", "Contacto", "Revision"];

export function ReportForm() {
  const [state, formAction, pending] = useActionState(submitCase, { ok: false, message: "" });

  return (
    <form action={formAction} className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <span key={step} className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-black text-civic ring-1 ring-slate-200">
            {index + 1}. {step}
          </span>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black text-civic">Paso 1: Datos de la persona</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nombre completo"><input name="full_name" className={inputClass} required /></Field>
          <Field label="Apodo"><input name="nickname" className={inputClass} /></Field>
          <Field label="Edad"><input name="age" type="number" min="0" className={inputClass} required /></Field>
          <Field label="Genero">
            <select name="gender" className={inputClass} required>
              <option value="">Seleccione</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="non_binary">No binario</option>
              <option value="unknown">No especificado</option>
            </select>
          </Field>
          <Field label="Estatura"><input name="height" className={inputClass} placeholder="Ej. 5'7&quot;" /></Field>
          <Field label="Rasgos fisicos"><textarea name="physical_traits" className={textareaClass} required /></Field>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black text-civic">Paso 2: Datos de la ultima vez visto</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Provincia"><ProvinceSelect /></Field>
          <Field label="Municipio"><input name="municipality" className={inputClass} required /></Field>
          <Field label="Lugar exacto donde fue visto por ultima vez"><input name="location_last_seen" className={inputClass} required /></Field>
          <Field label="Fecha en que fue visto por ultima vez"><input name="date_last_seen" type="date" className={inputClass} required /></Field>
          <Field label="Hora en que fue visto por ultima vez"><input name="time_last_seen" type="time" className={inputClass} required /></Field>
          <Field label="Ropa que llevaba"><textarea name="clothing_description" className={textareaClass} required /></Field>
          <Field label="Circunstancias"><textarea name="circumstances" className={textareaClass} required /></Field>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black text-civic">Paso 3: Subir foto</h2>
        <Field label="Subir foto">
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} />
        </Field>
        <p className="mt-3 text-sm leading-6 text-slate-600">Limite recomendado: 5 MB. JPG, PNG o WebP.</p>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black text-civic">Paso 4: Informacion de contacto</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nombre de contacto"><input name="contact_name" className={inputClass} required /></Field>
          <Field label="Telefono"><input name="phone" className={inputClass} required /></Field>
          <Field label="WhatsApp"><input name="whatsapp" className={inputClass} required /></Field>
          <Field label="Correo electronico"><input name="email" type="email" className={inputClass} required /></Field>
          <Field label="Denuncia policial realizada">
            <select name="police_report" className={inputClass} required>
              <option value="">Seleccione</option>
              <option value="yes">Si</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black text-civic">Paso 5: Revisar y enviar</h2>
        <label className="mt-4 flex gap-3 text-sm font-semibold leading-6 text-slate-700">
          <input name="consent" type="checkbox" required className="mt-1 h-4 w-4" />
          Confirmo que tengo autorizacion para enviar este caso y acepto que Echo RD lo revise antes de publicarlo.
        </label>
        <CaptchaNotice />
        {state.message && (
          <p className={`rounded-xl p-4 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-alert"}`}>
            {state.message}
          </p>
        )}
        <button disabled={pending} className="mt-5 w-full rounded-xl bg-alert px-6 py-4 font-black text-white disabled:opacity-60">
          {pending ? "Enviando..." : "Enviar caso para revision"}
        </button>
      </section>
    </form>
  );
}
