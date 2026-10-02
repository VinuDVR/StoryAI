"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChoiceView, GameView } from "@/lib/view";

type Panel = null | "bonds" | "journal" | "history";

const ENDING_STYLE: Record<string, { label: string; tone: string }> = {
  romance: { label: "Romance ending", tone: "from-rose-400 to-fuchsia-400" },
  hopeful: { label: "Hopeful ending", tone: "from-emerald-300 to-sky-400" },
  bittersweet: { label: "Bittersweet ending", tone: "from-amber-300 to-rose-400" },
  dark: { label: "Dark ending", tone: "from-slate-300 to-violet-400" },
  neutral: { label: "Ending", tone: "from-zinc-200 to-zinc-400" },
};

export default function Reader({ initial }: { initial: GameView }) {
  const router = useRouter();
  const [view, setView] = useState<GameView>(initial);
  const [panel, setPanel] = useState<Panel>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ message: string; needGems?: number } | null>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  async function pick(c: ChoiceView) {
    if (busy || c.locked) return;
    if (c.premium && pending !== c.key) {
      setPending(c.key);
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    setRewardNotice(null);
    try {
      const res = await fetch(`/api/play/${view.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: c.key }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "Something went wrong", needGems: data.needGems });
        setPending(null);
        return;
      }
      setView(data.view as GameView);
      const rewards = data.rewards as { amount: number; description: string }[] | undefined;
      if (rewards?.length) {
        setRewardNotice(rewards.map((reward) => `+${reward.amount} 💎 ${reward.description}`).join(" · "));
      }
      setPending(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    } catch {
      setError({ message: "Network problem. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function playAgain() {
    setBusy(true);
    const res = await fetch("/api/play/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: view.slug }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/play/${data.id}`);
      router.refresh();
    } else setBusy(false);
  }

  async function share() {
    if (!view.ending) return;
    const text = `I reached Ending ${String(view.ending.number).padStart(2, "0")}: "${view.ending.title}" in ${view.storyTitle} on StoryWeave.`;
    const url = `${window.location.origin}/story/${view.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: view.storyTitle, text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      /* user cancelled */
    }
  }

  const progress = Math.min(100, Math.round((view.chapter / Math.max(1, view.totalChapters)) * 100));
  const ending = view.ending;
  const style = ending ? (ENDING_STYLE[ending.type] ?? ENDING_STYLE.neutral) : null;

  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{
        background: `radial-gradient(900px 420px at 50% -80px, ${view.coverFrom}66, transparent 70%), radial-gradient(700px 400px at 100% 100%, ${view.coverTo}55, transparent 70%)`,
      }}
    >
      <div className="mx-auto max-w-2xl px-5 pb-28 pt-6">
        {/* top bar */}
        <div className="mb-3 flex items-center justify-between text-sm">
          <Link href={`/story/${view.slug}`} className="text-zinc-400 hover:text-white">
            ← {view.storyTitle}
          </Link>
          <div className="flex gap-1.5">
            <button onClick={() => setPanel("bonds")} className="rounded-full border border-white/10 px-3 py-1.5 text-zinc-300 hover:bg-white/10">
              ❤️ Bonds
            </button>
            <button onClick={() => setPanel("journal")} className="rounded-full border border-white/10 px-3 py-1.5 text-zinc-300 hover:bg-white/10">
              📖 Journal
            </button>
          </div>
        </div>
        {rewardNotice && (
          <p role="status" className="mb-5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            {rewardNotice}
          </p>
        )}
        <div className="mb-10 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-700" style={{ width: `${ending ? 100 : progress}%` }} />
        </div>

        {/* scene */}
        <article key={view.node.key} className="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            {ending ? `Ending ${String(ending.number).padStart(2, "0")}` : `Chapter ${view.chapter}`}
          </p>
          <h1 className="font-story mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">{view.node.title}</h1>

          {view.notice.echo || view.notice.shifted.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              {view.notice.echo && <p className="font-story italic">✦ {view.notice.echo}</p>}
              {view.notice.shifted.length > 0 && (
                <p className="mt-1 text-xs uppercase tracking-widest text-violet-300/80">
                  Relationship changed · {view.notice.shifted.join(", ")}
                </p>
              )}
            </div>
          ) : null}

          <div className="mt-8 space-y-5">
            {view.node.blocks.map((b, i) => {
              const delay = { animationDelay: `${Math.min(i, 12) * 70}ms` };
              if (b.type === "dialogue")
                return (
                  <div key={i} className="fade-up border-l-2 pl-4" style={{ ...delay, borderColor: b.color ?? "#a78bfa" }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: b.color ?? "#c4b5fd" }}>
                      {b.speaker}
                    </p>
                    <p className="font-story mt-1 text-xl leading-8 text-zinc-50">“{b.text}”</p>
                  </div>
                );
              if (b.type === "thought")
                return (
                  <p key={i} className="font-story fade-up border-l border-white/20 pl-4 text-xl italic leading-8 text-amber-100/80" style={delay}>
                    {b.text}
                  </p>
                );
              if (b.type === "system")
                return (
                  <p key={i} className="fade-up rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.25em] text-zinc-100" style={delay}>
                    {b.text}
                  </p>
                );
              return (
                <p key={i} className="font-story fade-up text-xl leading-8 text-zinc-200" style={delay}>
                  {b.text}
                </p>
              );
            })}
          </div>
        </article>

        {/* choices */}
        {!ending && (
          <div className="fade-up-3 mt-12 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">What do you do?</p>
            {view.choices.map((c, i) => {
              const confirming = pending === c.key;
              const cannotAfford = c.premium && view.gems < c.price;
              return (
                <div key={c.key}>
                  <button
                    disabled={busy || c.locked}
                    onClick={() => pick(c)}
                    className={`group relative w-full rounded-2xl border px-5 py-4 text-left transition ${
                      c.locked
                        ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-500"
                        : c.premium
                          ? "border-amber-400/40 bg-gradient-to-r from-amber-400/10 to-fuchsia-500/10 text-zinc-100 hover:border-amber-300/80"
                          : "border-white/10 bg-white/[0.04] text-zinc-100 hover:border-violet-400/70 hover:bg-white/[0.08]"
                    } ${confirming ? "ring-2 ring-amber-300/70" : ""}`}
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-xs text-zinc-400">
                        {c.locked ? "🔒" : i + 1}
                      </span>
                      <span className="font-story text-lg leading-7">{c.text}</span>
                    </span>
                    {c.premium && (
                      <span className="mt-2 ml-9 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-200">
                        💎 Premium · {c.price} gems
                      </span>
                    )}
                    {c.locked && <span className="mt-2 ml-9 block text-sm italic text-zinc-500">{c.lockReason}</span>}
                  </button>
                  {confirming && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300/30 bg-amber-300/5 px-4 py-3 text-sm">
                      {cannotAfford ? (
                        <>
                          <span className="text-amber-100">You need {c.price - view.gems} more gems. You can always take the free path instead.</span>
                          <Link href="/gems" className="rounded-full bg-amber-300 px-4 py-1.5 font-semibold text-black">
                            Get gems
                          </Link>
                        </>
                      ) : (
                        <>
                          <span className="text-amber-100">
                            Spend {c.price} 💎 for this extra possibility? You have {view.gems}.
                          </span>
                          <button onClick={() => pick(c)} disabled={busy} className="rounded-full bg-amber-300 px-4 py-1.5 font-semibold text-black disabled:opacity-60">
                            {busy ? "Spending…" : "Confirm"}
                          </button>
                        </>
                      )}
                      <button onClick={() => setPending(null)} className="text-zinc-400 hover:text-white">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {error && (
              <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error.message}{" "}
                {error.needGems ? (
                  <Link href="/gems" className="underline">
                    Get gems
                  </Link>
                ) : null}
              </p>
            )}
          </div>
        )}

        {/* ending card */}
        {ending && style && (
          <section className="fade-up-3 mt-14 overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-7 backdrop-blur">
            <p className={`bg-gradient-to-r ${style.tone} bg-clip-text text-xs font-bold uppercase tracking-[0.3em] text-transparent`}>
              {style.label}
            </p>
            <h2 className="font-story mt-2 text-3xl font-semibold text-white">You changed the story.</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat value={String(ending.majorChoices)} label="Major choices shaped this" />
              <Stat value={`${ending.secretsFound}/${ending.secretsTotal}`} label="Hidden decisions discovered" />
              <Stat value={`${ending.endingsFound}/${ending.endingsTotal}`} label="Endings found" />
            </div>

            <div className="mt-7 space-y-3">
              {view.bonds
                .filter((b) => b.stats.length > 0)
                .map((b) => (
                  <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">
                      {b.emoji} {b.name}
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {b.stats.map((s) => (
                        <Bar key={s.label} label={`${s.icon} ${s.label}`} pct={s.pct} color={b.color} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Endings in this story</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ending.endings.map((e) => (
                  <span
                    key={e.key}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      e.current
                        ? "border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-100"
                        : e.found
                          ? "border-white/20 text-zinc-200"
                          : "border-dashed border-white/10 text-zinc-600"
                    }`}
                  >
                    {e.found ? e.title : "? ? ?"}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-zinc-400">What would have happened if you had trusted someone else? Play again to find out.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={playAgain} disabled={busy} className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                Play again
              </button>
              <button onClick={share} className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5">
                {copied ? "Copied!" : "Share ending"}
              </button>
              <Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5">
                Return home
              </Link>
              <button onClick={() => setPanel("history")} className="rounded-full px-4 py-3 text-sm text-zinc-400 hover:text-white">
                View choice history
              </button>
            </div>
          </section>
        )}
      </div>

      {/* side panel */}
      {panel && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button aria-label="Close" className="absolute inset-0 bg-black/60" onClick={() => setPanel(null)} />
          <aside className="slide-in relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#100e1a]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex gap-1 text-sm">
                {(["bonds", "journal", "history"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPanel(p)}
                    className={`rounded-full px-3 py-1.5 capitalize ${panel === p ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    {p === "bonds" ? "Bonds" : p === "journal" ? "Journal" : "Choices"}
                  </button>
                ))}
              </div>
              <button onClick={() => setPanel(null)} className="text-2xl leading-none text-zinc-400 hover:text-white">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {panel === "bonds" && (
                <div className="space-y-4">
                  {view.bonds.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full text-xl" style={{ background: `${b.color}22` }}>
                          {b.emoji}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{b.name}</p>
                          <p className="text-xs text-zinc-400">{b.role}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">{b.blurb}</p>
                      {b.stats.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {b.stats.map((s) => (
                            <Bar key={s.label} label={`${s.icon} ${s.label}`} pct={s.pct} color={b.color} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-zinc-500">Characters remember more than these bars show. Some choices are felt only later.</p>
                </div>
              )}
              {panel === "journal" && (
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Your traits</p>
                    <div className="space-y-2">
                      {view.traits.map((t) => (
                        <Bar key={t.label} label={t.label} pct={Math.min(100, t.value * 10)} color="#a78bfa" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">What you&apos;ve done</p>
                    {view.journal.flags.length === 0 ? (
                      <p className="text-sm text-zinc-500">Nothing yet. The story is just beginning.</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {view.journal.flags.map((f) => (
                          <li key={f.label} className="flex items-start gap-2 text-zinc-200">
                            <span className={f.secret ? "text-fuchsia-300" : "text-emerald-300"}>{f.secret ? "✦" : "✓"}</span>
                            <span>
                              {f.label}
                              {f.secret && <span className="ml-2 text-xs text-fuchsia-300/80">hidden decision</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {view.journal.items.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Inventory</p>
                      <div className="flex flex-wrap gap-2">
                        {view.journal.items.map((i) => (
                          <span key={i} className="rounded-full border border-white/15 px-3 py-1 text-sm text-zinc-200">
                            🎒 {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {panel === "history" && (
                <ol className="space-y-3">
                  {view.history.length === 0 && <p className="text-sm text-zinc-500">No choices yet.</p>}
                  {view.history.map((h) => (
                    <li key={h.step} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                        Ch. {h.chapter} · {h.scene}
                        {h.major && <span className="ml-2 text-violet-300">major</span>}
                        {h.premium && <span className="ml-2 text-amber-300">💎 premium</span>}
                      </p>
                      <p className="font-story mt-1 text-zinc-100">{h.choice}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-story text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-4 text-zinc-400">{label}</p>
    </div>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-zinc-300">
        <span>{label}</span>
        <span className="text-zinc-500">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
