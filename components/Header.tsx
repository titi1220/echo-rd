import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { HeaderLiveCount } from "@/components/HeaderLiveCount";

const nav = [
  ["Casos", "/cases"],
  ["Reportar", "/report"],
  ["Localizados", "/found-safe"],
  ["Contacto", "/contact"]
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal text-white shadow-civic">
            <ShieldCheck size={22} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-civic">Echo RD</span>
            <span className="block text-xs font-semibold text-slate-500">Alerta nacional solidaria</span>
          </span>
        </Link>
        <HeaderLiveCount />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-royal">
              {label}
            </Link>
          ))}
          <Link href="/admin" className="rounded-full border border-slate-200 px-4 py-2 text-civic hover:border-royal hover:text-royal">
            Panel
          </Link>
        </nav>
        <Link href="/report" className="rounded-full bg-alert px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-900/15 md:hidden">
          Reportar
        </Link>
      </div>
    </header>
  );
}
