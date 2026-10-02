import Link from "next/link";
import { validateStory, type StoryReport } from "@/lib/validate";
import { STORIES } from "@/stories";

export const dynamic = "force-dynamic";

const g = globalThis as typeof globalThis & { __swReports?: StoryReport[] };

function reports(): StoryReport[] {
  if (!g.__swReports) g.__swReports = STORIES.map((s) => validateStory(s, 1500));
  return g.__swReports;
}

export default function StudioPage() {
  const list = reports();
  const bad = list.filter((r) => r.errors.length).length;

  return (
    <main className="mx-auto max-w-5xl px-6 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Story studio</p>
      <h1 className="font-story mt-2 text-4xl font-semibold text-white">Story compiler report</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Every story is checked before it is published: graph integrity, dead ends, orphans, loops, unknown stats and flags, premium
        pricing, plus simulated playthroughs to prove each ending can be reached, including without spending gems.
      </p>
      <p className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${bad ? "bg-rose-400/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"}`}>
        {bad ? `${bad} stories have errors` : `All ${list.length} stories pass validation`}
      </p>

      <div className="mt-8 space-y-5">
        {list.map((r) => (
          <section key={r.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href={`/story/${r.slug}`} className="font-story text-2xl font-semibold text-white hover:underline">
                {r.title}
              </Link>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.errors.length ? "bg-rose-400/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"}`}>
                {r.errors.length ? `${r.errors.length} errors` : "Valid"}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              {r.nodeCount} nodes · {r.choiceCount} choices · {r.premiumCount} premium ({Math.round((r.premiumCount / Math.max(1, r.choiceCount)) * 100)}%) · {r.endingCount} endings · {r.chapterCount} chapters
            </p>
            {r.errors.map((e) => (
              <p key={e} className="mt-2 text-sm text-rose-300">
                ✗ {e}
              </p>
            ))}
            {r.warnings.map((w) => (
              <p key={w} className="mt-2 text-sm text-amber-300">
                ! {w}
              </p>
            ))}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {r.sim.endings.map((e) => {
                const free = r.sim.free[e.key] ?? 0;
                const all = r.sim.all[e.key] ?? 0;
                return (
                  <div key={e.key} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
                    <p className="text-zinc-200">{e.title}</p>
                    <p className="text-xs text-zinc-500">
                      {free > 0 ? "✓ free path" : all > 0 ? "premium path only" : "✗ not reached"} · {Math.round((all / r.sim.runs) * 100)}% of random runs
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
