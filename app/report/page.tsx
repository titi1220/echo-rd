import { ReportForm } from "@/app/report/ReportForm";

export const metadata = {
  title: "Reportar caso",
  description: "Formulario seguro para reportar una persona desaparecida en Echo RD."
};

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-alert">Reporte seguro</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-civic">Reportar persona desaparecida</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Los casos enviados entran como pendientes y pasan por revisión urgente antes de publicarse. Echo RD no reemplaza a la Policía Nacional ni al 911.
        </p>
      </div>
      <ReportForm />
    </main>
  );
}
