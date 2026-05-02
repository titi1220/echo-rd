import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, HeartHandshake, Phone, Search, ShieldCheck } from "lucide-react";
import { CaseCard } from "@/components/CaseCard";
import { LiveMissingCount } from "@/components/LiveMissingCount";
import { SearchFilters } from "@/components/SearchFilters";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { demoCases, resources } from "@/lib/data";

export default function HomePage() {
  const active = demoCases.filter((item) => item.status !== "found_safe");
  const activeMissingCount = demoCases.filter((item) => ["active", "urgent"].includes(item.status)).length;
  const urgent = active.filter((item) => item.status === "urgent");
  const recent = [...active].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#003DA5_0_45%,#fff_45%_55%,#CE1126_55%_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20 lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-royal">
              <ShieldCheck size={17} /> Plataforma civica segura
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-civic sm:text-6xl">Cada minuto cuenta.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Ayudamos a familias a reportar, compartir y encontrar personas desaparecidas en Republica Dominicana.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/report" className="inline-flex items-center justify-center gap-2 rounded-xl bg-alert px-6 py-4 font-black text-white shadow-lg shadow-red-900/20">
                Reportar Caso <ArrowRight size={18} />
              </Link>
              <WhatsAppButton />
              <Link href="/cases" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-black text-civic shadow-sm">
                Ver Casos Activos <Search size={18} />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-civic shadow-civic">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,.25),transparent_30%),linear-gradient(135deg,#003DA5,#0B2E63_55%,#CE1126)]" />
            <div className="relative grid h-full content-end p-5 sm:p-8">
              <LiveMissingCount initialMissing={activeMissingCount} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SearchFilters />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-alert">Prioridad</p>
            <h2 className="text-3xl font-black tracking-tight text-civic">Casos urgentes</h2>
          </div>
          <Link href="/cases" className="text-sm font-black text-royal">Ver todos</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {urgent.map((item) => <CaseCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-royal">Actualizaciones</p>
              <h2 className="text-3xl font-black tracking-tight text-civic">Recien agregados</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {recent.map((item) => <CaseCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
          <CheckCircle2 className="text-emerald-700" size={32} />
          <h2 className="mt-4 text-2xl font-black text-civic">Historias de localizacion</h2>
          <p className="mt-3 leading-7 text-slate-600">Compartimos resoluciones con respeto, privacidad y enfoque en la reunificacion familiar.</p>
          <Link href="/found-safe" className="mt-5 inline-flex font-black text-emerald-700">Ver casos localizados</Link>
        </div>
        <div className="grid gap-3">
          {[
            ["Reporta", "La familia envia informacion y consentimiento.", Clock],
            ["Verificamos", "Moderadores revisan duplicados, riesgos y datos publicos.", ShieldCheck],
            ["Difundimos", "La comunidad comparte y envia pistas privadas.", HeartHandshake]
          ].map(([title, text, Icon]) => (
            <div key={String(title)} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <Icon className="mt-1 text-royal" size={24} />
              <div>
                <h3 className="font-black text-civic">{title as string}</h3>
                <p className="text-sm leading-6 text-slate-600">{text as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-wide text-alert">Recursos</p>
            <h2 className="text-3xl font-black tracking-tight text-civic">Contactos de emergencia</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
                <Phone className="text-alert" size={24} />
                <h3 className="mt-3 font-black text-civic">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-3 text-xl font-black text-royal">{item.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
