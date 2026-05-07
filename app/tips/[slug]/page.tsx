import Link from "next/link";
import { notFound } from "next/navigation";
import { TipForm } from "@/app/tips/[slug]/TipForm";
import { getCaseBySlugFromSource } from "@/lib/supabase-data";

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCaseBySlugFromSource(slug);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/cases/${item.slug}`} className="text-sm font-black text-royal">Volver al caso</Link>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-civic">Enviar pista privada</h1>
      <p className="mt-3 leading-7 text-slate-600">Tu información no será pública. Solo administradores autorizados podrán revisarla para el caso de {item.full_name}.</p>
      <div className="mt-8"><TipForm caseSlug={item.slug} /></div>
    </main>
  );
}
