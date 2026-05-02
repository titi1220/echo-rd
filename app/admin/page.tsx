import { BarChart3, ClipboardCheck, Eye, FileClock, Lock, MessageSquare, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, StatusBadge } from "@/components/Badge";
import { getAdminCases, getAdminSightings, getResources } from "@/lib/supabase-data";
import { statusLabel } from "@/lib/utils";

const priorityLabel: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta"
};

const sightingStatusLabel: Record<string, string> = {
  new: "Nuevo",
  reviewing: "En revision",
  credible: "Creible",
  false_lead: "Pista falsa",
  forwarded: "Enviado",
  archived: "Archivado"
};

const roles = [
  ["Super administrador", "Gestiona administradores, aprueba o rechaza casos, edita, elimina, archiva, revisa datos privados y administra recursos y pagina principal."],
  ["Moderador", "Aprueba o rechaza casos, revisa pistas y reportes, marca casos urgentes o localizados, y agrega notas internas."],
  ["Editor", "Corrige ortografia, actualiza contenido publico de casos y administra recursos publicos sin aprobar casos por defecto."]
];

const stats: Array<[string, number, LucideIcon]> = [
  ["Casos activos", 0, ShieldCheck],
  ["Casos pendientes", 3, FileClock],
  ["Casos localizados", 0, ClipboardCheck],
  ["Pistas recibidas", 14, MessageSquare],
  ["Reportes", 0, Eye]
];

export const metadata = {
  title: "Panel administrativo",
  description: "Panel administrativo seguro de Echo RD."
};

export default async function AdminPage() {
  const [cases, sightings, resources] = await Promise.all([getAdminCases(), getAdminSightings(), getResources()]);
  const active = cases.filter((item) => ["active", "urgent"].includes(item.status)).length;
  const found = cases.filter((item) => item.status === "found_safe").length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-alert">Requiere autenticacion de Supabase</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-civic">Panel administrativo</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">Acceso por roles para super administradores, moderadores y editores. Los datos sensibles nunca se exponen publicamente.</p>
        </div>
        <div className="rounded-2xl bg-civic p-4 text-white"><Lock className="mb-2" /><p className="text-sm font-bold">Ruta protegida lista para seguridad</p></div>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, defaultValue, Icon]) => {
          const value = label === "Casos activos" ? active : label === "Casos localizados" ? found : label === "Reportes" ? sightings.length : defaultValue;
          return (
          <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <Icon className="text-royal" />
            <p className="mt-4 text-3xl font-black text-civic">{String(value)}</p>
            <p className="text-sm font-bold text-slate-500">{String(label)}</p>
          </div>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-black text-civic"><FileClock className="text-alert" /> Cola de revision de casos</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Caso</th><th>Estado</th><th>Provincia</th><th>Cola</th><th>Acciones</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {cases.slice(0, 5).map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-4 font-black text-civic">{item.full_name}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>{item.province}</td>
                    <td>{["Reportes pendientes", "Necesita mas informacion", "Aprobado", "Rechazado", "Duplicado"][index]}</td>
                    <td className="space-x-2"><button className="font-bold text-royal">Aprobar</button><button className="font-bold text-alert">Rechazar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-black text-civic">Roles</h2>
          <div className="mt-5 grid gap-3">
            {roles.map(([role, description]) => (
              <div key={role} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black text-civic">{role}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-black text-civic"><MessageSquare className="text-royal" /> Bandeja de pistas</h2>
          <div className="mt-5 grid gap-3">
            {["Posible reporte en parada de autobus", "Llamada con nueva informacion de ruta", "Solicitud familiar de correccion"].map((tip, index) => (
              <div key={tip} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between"><p className="font-black text-civic">{tip}</p><Badge tone={index === 0 ? "red" : "blue"}>{index === 0 ? "Urgente" : "Revisado"}</Badge></div>
                <p className="mt-2 text-sm text-slate-600">Los datos privados de quien envia la informacion quedan ocultos fuera de permisos administrativos.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-black text-civic"><Eye className="text-alert" /> Reportes recibidos</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Caso</th><th>Lugar</th><th>Fecha/hora</th><th>Archivos</th><th>Prioridad</th><th>Estado</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {sightings.map((item) => {
                  const related = cases.find((c) => c.id === item.case_id);
                  return (
                    <tr key={item.id}>
                      <td className="py-4 font-black text-civic">{related?.full_name}</td>
                      <td>{item.location_text}</td>
                      <td>{item.date_seen} {item.time_seen}</td>
                      <td>{item.image_url ? "Imagen" : "Sin archivos"}</td>
                      <td><Badge tone={item.priority === "high" ? "red" : "blue"}>{priorityLabel[item.priority]}</Badge></td>
                      <td>{sightingStatusLabel[item.status]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-black text-civic"><BarChart3 className="text-royal" /> Analitica</h2>
          <div className="mt-5 grid gap-3">
            {resources.map((item) => <div key={item.title} className="flex justify-between rounded-xl bg-slate-50 p-3"><span>{item.category}</span><span className="font-black text-royal">{item.phone}</span></div>)}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-black text-civic"><Users className="text-alert" /> Registro de actividad</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {cases.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                <p className="font-bold text-civic">admin_demo actualizo {item.full_name}</p>
                <p className="text-slate-500">Accion: {statusLabel(item.status)} | Notas: revision interna registrada</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
