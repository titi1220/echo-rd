import { Building2, Mail, MessageCircle } from "lucide-react";
import { CaptchaNotice, Field, inputClass, textareaClass } from "@/components/FormElements";

export const metadata = {
  title: "Contacto",
  description: "Contacto, WhatsApp y alianzas de Echo RD."
};

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[.9fr_1.1fr] lg:px-8">
      <section>
        <p className="text-sm font-black uppercase tracking-wide text-alert">Contacto</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-civic">Estamos para ayudar</h1>
        <p className="mt-3 leading-7 text-slate-600">Para emergencias, llama al 911. Para alianzas, soporte o correcciones, contacta a Echo RD.</p>
        <div className="mt-8 grid gap-4">
          <div className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Mail className="text-royal" /><div><p className="font-black">Correo electronico</p><p className="text-slate-600">ayuda@echord.do</p></div></div>
          <div className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><MessageCircle className="text-emerald-700" /><div><p className="font-black">WhatsApp</p><p className="text-slate-600">+1 809 000 0000</p></div></div>
          <div className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Building2 className="text-alert" /><div><p className="font-black">Consulta para aliados</p><p className="text-slate-600">Municipios, ONGs, medios y entidades de apoyo.</p></div></div>
        </div>
      </section>
      <form className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Field label="Nombre"><input className={inputClass} required /></Field>
        <Field label="Correo electronico"><input type="email" className={inputClass} required /></Field>
        <Field label="Motivo">
          <select className={inputClass}>
            <option>Contacto general</option>
            <option>Consulta para aliados</option>
            <option>Correccion de informacion</option>
          </select>
        </Field>
        <Field label="Mensaje"><textarea className={textareaClass} required /></Field>
        <CaptchaNotice />
        <button className="rounded-xl bg-royal px-6 py-4 font-black text-white">Enviar mensaje</button>
      </form>
    </main>
  );
}
