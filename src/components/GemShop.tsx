"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Pack {
  id: string;
  gems: number;
  label: string;
  blurb: string;
}

export default function GemShop({ packs, dailyGems, canClaim }: { packs: Pack[]; dailyGems: number; canClaim: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function call(body: Record<string, string>, key: string) {
    setBusy(key);
    setMessage(null);
    try {
      const res = await fetch("/api/gems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setMessage({ text: data.message ?? data.error ?? "Done", ok: res.ok });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-fuchsia-500/10 p-6">
        <h2 className="font-story text-2xl font-semibold text-white">Daily gems</h2>
        <p className="mt-1 text-sm text-zinc-300">Sign in each day for {dailyGems} free gems. You can also claim them here if you are already signed in.</p>
        <button
          onClick={() => call({ action: "daily" }, "daily")}
          disabled={busy !== null || !canClaim}
          className="mt-4 rounded-full bg-amber-300 px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
        >
          {busy === "daily" ? "Claiming…" : canClaim ? `Claim ${dailyGems} gems` : "Daily reward claimed"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {packs.map((p) => (
          <div key={p.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-3xl">💎</p>
            <p className="font-story mt-2 text-3xl font-semibold text-white">{p.gems}</p>
            <p className="text-sm font-medium text-zinc-200">{p.label}</p>
            <p className="mt-1 text-xs text-zinc-500">{p.blurb}</p>
            <button
              type="button"
              disabled
              title="Gem purchases are not available yet"
              className="mt-4 w-full cursor-not-allowed rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-500"
            >
              Purchases coming later
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Earn gems through daily sign-ins and story progress. Paid gem packs are not available yet.
      </p>

      {message && (
        <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${message.ok ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
