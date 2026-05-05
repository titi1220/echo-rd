"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  ["Casos", "/cases"],
  ["Reportar", "/report"],
  ["Localizados", "/found-safe"],
  ["Contacto", "/contact"],
  ["Panel", "/admin"]
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        aria-expanded={open}
        aria-label={open ? "Cerrar menu" : "Abrir menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-civic shadow-sm"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
          <div className="border-b border-slate-100 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-alert">Menu principal</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Acceso rapido a Echo RD</p>
          </div>
          <nav className="grid p-2 text-base font-black text-civic">
            {nav.map(([label, href]) => (
              <Link
                className="rounded-xl px-4 py-3 hover:bg-slate-50 hover:text-royal"
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 p-3">
            <Link
              className="block rounded-xl bg-alert px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-red-900/15"
              href="/report"
              onClick={() => setOpen(false)}
            >
              Reportar caso
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
