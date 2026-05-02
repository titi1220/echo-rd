import { cn, statusLabel } from "@/lib/utils";

export function Badge({ tone = "blue", children }: { tone?: "blue" | "red" | "green" | "gray" | "amber"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tone === "blue" && "bg-blue-50 text-royal ring-1 ring-blue-100",
        tone === "red" && "bg-red-50 text-alert ring-1 ring-red-100",
        tone === "green" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        tone === "gray" && "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
        tone === "amber" && "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "urgent" ? "red" : status === "found_safe" ? "green" : status === "pending" ? "amber" : "blue";
  return <Badge tone={tone}>{statusLabel(status)}</Badge>;
}
