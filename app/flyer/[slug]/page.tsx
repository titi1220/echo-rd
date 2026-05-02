import Image from "next/image";
import { notFound } from "next/navigation";
import { getCaseBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function FlyerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl bg-white px-6 py-8 print:max-w-none">
      <div className="border-8 border-alert p-5">
        <p className="text-center text-2xl font-black text-alert">PERSONA DESAPARECIDA</p>
        <h1 className="mt-2 text-center text-5xl font-black text-civic">{item.full_name}</h1>
        <div className="relative mx-auto mt-6 aspect-[4/3] max-w-lg overflow-hidden rounded-2xl">
          <Image src={item.photo_url} alt={item.full_name} fill className="object-cover" />
        </div>
        <div className="mt-6 grid gap-3 text-xl font-bold text-civic">
          <p>Edad: {item.age}</p>
          <p>Ultima vez: {formatDate(item.date_last_seen)} | {item.time_last_seen}</p>
          <p>Lugar: {item.location_last_seen}, {item.province}</p>
          <p>Vestimenta: {item.clothing_description}</p>
        </div>
        <p className="mt-6 rounded-xl bg-civic p-4 text-center text-2xl font-black text-white">Si tiene informacion: {item.contact_phone}</p>
        <p className="mt-4 text-center text-sm font-bold text-slate-500">DATOS DEMO | Echo RD no reemplaza a las autoridades. En emergencia llame al 911.</p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: "setTimeout(() => window.print(), 500)" }} />
    </main>
  );
}
