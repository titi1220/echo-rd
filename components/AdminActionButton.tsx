"use client";

import { useTransition } from "react";

export function AdminActionButton({
  children,
  action,
  tone = "blue"
}: {
  children: React.ReactNode;
  action: () => Promise<{ ok: boolean; message: string }>;
  tone?: "blue" | "red" | "green" | "gray";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => {
        void action();
      })}
      className={
        "font-bold disabled:opacity-50 " +
        (tone === "red" ? "text-alert" : tone === "green" ? "text-emerald-700" : tone === "gray" ? "text-slate-600" : "text-royal")
      }
      type="button"
    >
      {pending ? "..." : children}
    </button>
  );
}
