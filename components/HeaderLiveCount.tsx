"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

export function HeaderLiveCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) return;
        const stats = (await response.json()) as { missing: number };
        if (!cancelled) setCount(stats.missing);
      } catch {
        if (!cancelled) setCount(null);
      }
    }

    loadCount();
    const timer = window.setInterval(loadCount, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-royal sm:flex" aria-live="polite">
      <Radio size={14} className="animate-pulse" />
      {count === null ? "Cargando conteo" : `${count} desaparecidos`}
    </div>
  );
}
