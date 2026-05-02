import { CaseCard } from "@/components/CaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { demoCases } from "@/lib/data";

export const metadata = {
  title: "Casos activos",
  description: "Directorio de casos activos y urgentes en Echo RD."
};

export default function CasesPage() {
  const cases = demoCases.filter((item) => ["active", "urgent"].includes(item.status));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-alert">Directorio nacional</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-civic">Casos activos</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Busca por nombre o apodo, filtra por provincia y revisa casos urgentes primero.</p>
      </div>
      <div className="mb-6">
        <SearchFilters showGender />
        <div className="mt-3 flex justify-end">
          <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-royal">
            <option>Ordenar: urgentes primero</option>
            <option>Ordenar: mas recientes</option>
          </select>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((item) => <CaseCard key={item.id} item={item} />)}
      </div>
    </main>
  );
}
