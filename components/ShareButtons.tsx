"use client";

import { Copy, Facebook, MessageCircle, Printer } from "lucide-react";

export function ShareButtons({ title, url, flyerUrl }: { title: string; url: string; flyerUrl: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <a className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer">
        <MessageCircle size={18} /> WhatsApp
      </a>
      <a className="flex items-center justify-center gap-2 rounded-xl bg-royal px-4 py-3 text-sm font-bold text-white" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">
        <Facebook size={18} /> Facebook
      </a>
      <button
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-civic"
        onClick={() => navigator.clipboard.writeText(url)}
        type="button"
      >
        <Copy size={18} /> Copiar
      </button>
      <a className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-civic" href={flyerUrl} target="_blank">
        <Printer size={18} /> Afiche
      </a>
    </div>
  );
}
