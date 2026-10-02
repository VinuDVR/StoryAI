"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

type Mode = "login" | "register";

export default function AccountForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        displayName: formData.get("displayName"),
      }),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string; dailyReward?: number };
    setPending(false);
    if (!response.ok) {
      setError(result.error ?? "Could not sign you in. Try again.");
      return;
    }
    router.replace(result.dailyReward ? "/account?dailyReward=1" : "/account");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
      <div className="flex rounded-full border border-white/10 bg-black/20 p-1" role="group" aria-label="Account action">
        {(["register", "login"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => {
              setMode(option);
              setError("");
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              mode === option ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <h2 className="font-story mt-7 text-3xl font-semibold text-white">
        {mode === "register" ? "Create your account" : "Welcome back"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        {mode === "register" ? "Keep your stories, progress, and gems with you." : "Sign in to continue your stories."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        {mode === "register" && (
          <label className="block text-sm text-zinc-300">
            Display name <span className="text-zinc-500">(optional)</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 focus-within:border-violet-400/50">
              <UserRound className="h-4 w-4 shrink-0 text-zinc-500" />
              <input name="displayName" autoComplete="nickname" maxLength={40} className="h-11 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600" placeholder="How should we address you?" />
            </span>
          </label>
        )}
        <label className="block text-sm text-zinc-300">
          Email
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 focus-within:border-violet-400/50">
            <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="h-11 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600" placeholder="you@example.com" />
          </span>
        </label>
        <label className="block text-sm text-zinc-300">
          Password
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 focus-within:border-violet-400/50">
            <LockKeyhole className="h-4 w-4 shrink-0 text-zinc-500" />
            <input name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} maxLength={128} required className="h-11 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600" placeholder="At least 8 characters" />
          </span>
        </label>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
          {pending ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </section>
  );
}