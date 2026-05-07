import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-DO", { dateStyle: "long" }).format(new Date(`${date}T12:00:00`));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    active: "Activo",
    urgent: "Urgente",
    found_safe: "Localizado sano y salvo",
    archived: "Archivado",
    rejected: "Rechazado",
    duplicate: "Duplicado",
    needs_more_info: "Necesita más información"
  };
  return labels[status] ?? status;
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function absoluteUrl(path = "") {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const base = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "http://localhost:3000";
  return `${base}${path}`;
}
