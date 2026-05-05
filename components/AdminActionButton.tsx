"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const result = await action();
          setMessage(result.message);
          if (result.ok) {
            router.refresh();
          }
        })}
        className={
          "font-bold disabled:opacity-50 " +
          (tone === "red" ? "text-alert" : tone === "green" ? "text-emerald-700" : tone === "gray" ? "text-slate-600" : "text-royal")
        }
        type="button"
      >
        {pending ? "..." : children}
      </button>
      {message && <span className="max-w-32 text-xs font-semibold text-slate-500">{message}</span>}
    </span>
  );
}
