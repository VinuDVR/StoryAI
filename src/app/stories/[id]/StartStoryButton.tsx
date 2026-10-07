"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2 } from "lucide-react";

export default function StartStoryButton({ storyId }: { storyId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStart() {
    setLoading(true);
    try {
      const res = await fetch("/api/playthroughs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (res.status === 401) {
        router.push(`/account?next=${encodeURIComponent(window.location.pathname)}`);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to start");
      const data = await res.json();
      router.push(`/play/${data.playthrough.id}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-sans font-semibold text-sm transition-colors glow-pulse"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      {loading ? "Starting…" : "Start Story"}
    </button>
  );
}
