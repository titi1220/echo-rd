import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import type { MissingCase } from "@/lib/types";
import { Badge, StatusBadge } from "@/components/Badge";
import { formatDate } from "@/lib/utils";

export function CaseCard({ item }: { item: MissingCase }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-civic">
      <Link href={`/cases/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image src={item.photo_url} alt={`Foto de ${item.full_name}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {item.demo && <Badge tone="gray">DATOS DEMO</Badge>}
            {item.urgency_level === "critical" && <Badge tone="red">Prioridad critica</Badge>}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-black tracking-tight text-civic">{item.full_name}</h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-500">{item.age} anos {item.nickname ? `| "${item.nickname}"` : ""}</p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <p className="flex gap-2"><MapPin size={17} className="mt-0.5 text-royal" /> {item.province}, {item.municipality}</p>
            <p className="flex gap-2"><CalendarDays size={17} className="mt-0.5 text-alert" /> Visto por ultima vez: {formatDate(item.date_last_seen)}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
