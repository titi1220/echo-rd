import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ className = "" }: { className?: string }) {
  const message = encodeURIComponent("Hola Echo RD, necesito ayuda con un caso de persona desaparecida.");

  return (
    <a
      href={`https://wa.me/18090000000?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700 ${className}`}
    >
      <MessageCircle size={19} />
      WhatsApp
    </a>
  );
}
