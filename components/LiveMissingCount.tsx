"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type Stats = {
  missing: number;
  urgent: number;
  foundSafe: number;
  pending: number;
  source: "demo" | "supabase";
  updatedAt: string;
};

const fallbackStats: Stats = {
  missing: 0,
  urgent: 0,
  foundSafe: 0,
  pending: 0,
  source: "demo",
  updatedAt: new Date().toISOString()
};

export function LiveMissingCount({ initialMissing }: { initialMissing: number }) {
  const [stats, setStats] = useState<Stats>({ ...fallbackStats, missing: initialMissing });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) return;
        const nextStats = (await response.json()) as Stats;
        if (!cancelled) setStats(nextStats);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadStats();
    const timer = window.setInterval(loadStats, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="rounded-3xl bg-white/95 p-5 shadow-2xl" aria-live="polite">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <Activity size={16} className={isLoading ? "animate-pulse text-royal" : "text-emerald-600"} />
            Conteo en vivo
          </p>
          <p className="text-3xl font-black text-civic">{stats.missing} desaparecidos</p>
        </div>
        <AlertTriangle className="text-alert" size={34} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-red-50 p-4">
          <AlertTriangle className="mx-auto mb-1 text-alert" size={18} />
          <p className="text-2xl font-black text-alert">{stats.urgent}</p>
          <p className="text-xs font-bold text-slate-600">Urgentes</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4">
          <Clock className="mx-auto mb-1 text-royal" size={18} />
          <p className="text-2xl font-black text-royal">{stats.pending}</p>
          <p className="text-xs font-bold text-slate-600">Pendientes</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <CheckCircle2 className="mx-auto mb-1 text-emerald-700" size={18} />
          <p className="text-2xl font-black text-emerald-700">{stats.foundSafe}</p>
          <p className="text-xs font-bold text-slate-600">Localizados</p>
        </div>
      </div>
      <p className="mt-4 text-center text-xs font-semibold text-slate-500">
        Actualiza cada 30 segundos · fuente: {stats.source === "supabase" ? "Supabase" : "demo"}
      </p>
    </div>
  );
}
