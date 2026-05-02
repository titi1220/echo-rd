import { CaptchaNotice, Field, inputClass, textareaClass } from "@/components/FormElements";

export const metadata = { title: "Correccion o retiro" };

export default function RemovalRequestPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-tight text-civic">Solicitud de correccion o retiro</h1>
      <p className="mt-3 leading-7 text-slate-600">Usa este formulario para pedir correcciones, retiro de contenido o actualizaciones de privacidad.</p>
      <form className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Field label="Nombre"><input className={inputClass} required /></Field>
        <Field label="Correo electronico"><input type="email" className={inputClass} required /></Field>
        <Field label="Enlace del caso"><input type="url" className={inputClass} required /></Field>
        <Field label="Solicitud"><textarea className={textareaClass} required /></Field>
        <CaptchaNotice />
        <button className="rounded-xl bg-civic px-6 py-4 font-black text-white">Enviar solicitud</button>
      </form>
    </main>
  );
}
