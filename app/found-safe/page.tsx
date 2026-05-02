import { CheckCircle2 } from "lucide-react";
import { CaseCard } from "@/components/CaseCard";
import { demoCases } from "@/lib/data";

export const metadata = {
  title: "Casos localizados",
  description: "Casos localizados sano y salvo en Echo RD."
};

export default function FoundSafePage() {
  const cases = demoCases.filter((item) => item.status === "found_safe");
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
        <CheckCircle2 className="text-emerald-700" size={34} />
        <h1 className="mt-3 text-4xl font-black tracking-tight text-civic">Casos localizados</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-700">Fue localizado sano y salvo. Estos casos se presentan con respeto y cuidado por la privacidad familiar.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((item) => <CaseCard key={item.id} item={item} />)}
      </div>
    </main>
  );
}
