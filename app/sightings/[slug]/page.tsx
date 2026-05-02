import Link from "next/link";
import { notFound } from "next/navigation";
import { SightingForm } from "@/app/sightings/[slug]/SightingForm";
import { getCaseBySlug } from "@/lib/data";

export default async function SightingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/cases/${item.slug}`} className="text-sm font-black text-royal">Volver al caso</Link>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-civic">¿Lo viste? Reportar</h1>
      <p className="mt-3 leading-7 text-slate-600">Comparte detalles para el caso de {item.full_name}. El reporte permanece privado hasta ser revisado.</p>
      <div className="mt-8"><SightingForm /></div>
    </main>
  );
}
