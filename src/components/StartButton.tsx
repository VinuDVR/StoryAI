"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StartButton({
  slug,
  label = "Start story",
  variant = "primary",
}: {
  slug: string;
  label?: string;
  variant?: "primary" | "ghost";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/play/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.status === 401) {
        router.push(`/account?next=${encodeURIComponent(window.location.pathname)}`);
        setBusy(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start");
      router.push(`/play/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start");
      setBusy(false);
    }
  }

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-900/30 hover:brightness-110"
      : "border border-white/15 text-zinc-200 hover:bg-white/5";

  return (
    <div>
      <button
        onClick={start}
        disabled={busy}
        className={`rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition disabled:opacity-60 ${styles}`}
      >
        {busy ? "Opening the book…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
