import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarDays, MapPin, MessageSquareWarning, Phone, ShieldCheck } from "lucide-react";
import { Badge, StatusBadge } from "@/components/Badge";
import { ShareButtons } from "@/components/ShareButtons";
import { getCaseBySlugFromSource } from "@/lib/supabase-data";
import { absoluteUrl, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseBySlugFromSource(slug);
  if (!item) return {};

  const title = `${item.full_name} | Caso ${item.status === "urgent" ? "urgente" : "activo"}`;
  const description = `${item.full_name}, ${item.age} años. Visto por última vez en ${item.province}, ${item.municipality}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: item.photo_url, width: 1200, height: 630, alt: item.full_name }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [item.photo_url]
    }
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCaseBySlugFromSource(slug);
  if (!item) notFound();

  const url = absoluteUrl(`/cases/${item.slug}`);

  return (
    <main className="bg-white">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-civic">
          <div className="relative aspect-[4/5]">
            <Image src={item.photo_url} alt={`Foto de ${item.full_name}`} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 45vw" />
          </div>
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {item.demo && <Badge tone="gray">DATOS DEMO</Badge>}
            <StatusBadge status={item.status} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone={item.urgency_level === "critical" ? "red" : "amber"}>{item.urgency_level === "critical" ? "Urgencia crítica" : "Prioridad alta"}</Badge>
            {item.verified && <Badge tone="blue">Verificado por moderación</Badge>}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-civic sm:text-5xl">{item.full_name}</h1>
          <p className="mt-2 text-lg font-bold text-slate-500">{item.age} años {item.nickname ? `| "${item.nickname}"` : ""}</p>
          <div className="mt-6 grid gap-3 text-slate-700">
            <p className="flex gap-3"><MapPin className="mt-0.5 text-royal" /> {item.location_last_seen}, {item.province}, {item.municipality}</p>
            <p className="flex gap-3"><CalendarDays className="mt-0.5 text-alert" /> {formatDate(item.date_last_seen)} a las {item.time_last_seen}</p>
            <p className="flex gap-3"><Phone className="mt-0.5 text-royal" /> Contacto: {item.contact_name} | {item.contact_phone}</p>
          </div>
          <div className="mt-8">
            <ShareButtons title={`Ayuda a encontrar a ${item.full_name}`} url={url} flyerUrl={`/flyer/${item.slug}`} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href={`/tips/${item.slug}`} className="flex items-center justify-center gap-2 rounded-xl bg-civic px-5 py-4 font-black text-white">
              <MessageSquareWarning size={18} /> Enviar pista privada
            </Link>
            <Link href={`/sightings/${item.slug}`} className="flex items-center justify-center gap-2 rounded-xl bg-alert px-5 py-4 font-black text-white">
              <AlertTriangle size={18} /> ¿Lo viste? Reportar
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-mist py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Vestimenta", item.clothing_description],
            ["Rasgos físicos", item.physical_traits],
            ["Circunstancias", item.circumstances]
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-black text-civic">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <ShieldCheck className="text-royal" />
          <h2 className="mt-3 text-xl font-black text-civic">Protección de identidad</h2>
          <p className="mt-2 leading-7 text-slate-700">
            Las pistas, reportes y datos de quienes escriben son privados. Solo admins autorizados pueden revisarlos para apoyar la verificación.
          </p>
        </div>
      </section>
    </main>
  );
}
