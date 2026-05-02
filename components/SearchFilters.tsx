"use client";

import { Search } from "lucide-react";
import { provinces } from "@/lib/data";

export function SearchFilters({ showGender = false }: { showGender?: boolean }) {
  return (
    <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
      <label className="relative md:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
        <input name="q" placeholder="Buscar por nombre o apodo" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-100" />
      </label>
      <select name="province" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-100">
        <option value="">Todas las provincias</option>
        {provinces.map((province) => <option key={province}>{province}</option>)}
      </select>
      {showGender ? (
        <select name="gender" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-100">
          <option value="">Genero</option>
          <option value="female">Femenino</option>
          <option value="male">Masculino</option>
          <option value="unknown">No especificado</option>
        </select>
      ) : (
        <button className="h-11 rounded-xl bg-royal px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/15">Buscar</button>
      )}
    </form>
  );
}
