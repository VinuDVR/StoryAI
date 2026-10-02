import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/StoryCard";
import StartButton from "@/components/StartButton";
import { REL_LABELS } from "@/lib/engine";
import { getEndingsFound, getPlayerId, getStoryBySlug, listPlaythroughs, loadGraph } from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const playerId = await getPlayerId();
  const [graph, found, journeys] = await Promise.all([
    loadGraph(story.id),
    getEndingsFound(playerId, story.id),
    listPlaythroughs(playerId),
  ]);
  const mine = journeys.filter((j) => j.slug === slug);
  const active = mine.find((j) => j.status === "active");
  const endings = [...graph.values()].filter((n) => n.isEnding).sort((a, b) => (a.endingNumber ?? 0) - (b.endingNumber ?? 0));
  const premiumCount = [...graph.values()].reduce((n, node) => n + node.choices.filter((c) => c.isPremium).length, 0);
  const meta = story.meta;

  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(900px 420px at 25% -10%, ${story.coverFrom}99, transparent 70%), radial-gradient(700px 400px at 90% 0%, ${story.coverTo}88, transparent 70%)` }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-10 pt-12 md:grid-cols-[320px_1fr]">
          <Cover
            from={story.coverFrom}
            to={story.coverTo}
            emoji={story.coverEmoji}
            image={story.coverImageUrl}
            className="fade-up aspect-[4/5] w-full max-w-xs self-start rounded-3xl border border-white/15 shadow-2xl shadow-black/60"
          />
          <div className="fade-up-2">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">
              ← All stories
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              {story.genres.map((g) => (
                <Link key={g} href={`/?genre=${encodeURIComponent(g)}`} className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200 hover:bg-white/10">
                  {g}
                </Link>
              ))}
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">{story.ageRating}</span>
            </div>
            <h1 className="font-story mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">{story.title}</h1>
            <p className="font-story mt-3 text-xl italic text-zinc-300">{story.tagline}</p>
            <p className="mt-6 max-w-2xl leading-7 text-zinc-300">{story.description}</p>

            <dl className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [String(story.chapterCount), "Chapters"],
                [String(graph.size - [...graph.values()].filter((n) => n.routes?.length).length), "Scenes"],
                [String(story.endingCount), "Endings"],
                [String(premiumCount), "Secret choices"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="text-xs text-zinc-500">{l}</dt>
                  <dd className="font-story text-2xl font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-zinc-500">Tone: {meta.tone}. Setting: {meta.setting}.</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {active && (
                <Link href={`/play/${active.id}`} className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white hover:brightness-110">
                  Continue · Chapter {active.chapter ?? 1}
                </Link>
              )}
              <StartButton slug={story.slug} label={active ? "Start over" : "Start story"} variant={active ? "ghost" : "primary"} />
            </div>
            {premiumCount > 0 && (
              <p className="mt-4 max-w-xl text-sm text-zinc-500">
                💎 Premium choices unlock extra scenes, clues and romance beats. They&apos;re never required: every ending stays reachable for free.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <h2 className="font-story text-2xl font-semibold text-white">Characters</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {meta.characters.map((c) => (
            <div key={c.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full text-2xl" style={{ background: `${c.color}22` }}>
                {c.emoji}
              </span>
              <p className="font-story mt-3 text-lg font-semibold text-white">{c.name}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: c.color }}>
                {c.role}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{c.blurb}</p>
              {c.rel.length > 0 && (
                <p className="mt-3 text-xs text-zinc-500">
                  Bond: {c.rel.map((r) => `${REL_LABELS[r]?.icon ?? ""} ${REL_LABELS[r]?.label ?? r}`).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-story text-2xl font-semibold text-white">Endings</h2>
          <p className="text-sm text-zinc-400">
            {found.size} of {endings.length} discovered
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {endings.map((e) => {
            const f = found.has(e.nodeKey);
            return (
              <div key={e.nodeKey} className={`rounded-2xl border p-4 ${f ? "border-violet-400/40 bg-violet-400/10" : "border-dashed border-white/10 bg-white/[0.02]"}`}>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Ending {String(e.endingNumber).padStart(2, "0")}</p>
                <p className={`font-story mt-1 text-lg font-semibold ${f ? "text-white" : "text-zinc-600"}`}>{f ? e.endingTitle : "Undiscovered"}</p>
                {f && <p className="mt-1 text-xs capitalize text-zinc-400">{e.endingType}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {mine.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-12">
          <h2 className="font-story text-2xl font-semibold text-white">Your playthroughs</h2>
          <ul className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
            {mine.map((j) => (
              <li key={j.id}>
                <Link href={`/play/${j.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-white/5">
                  <span className="text-zinc-200">
                    {j.status === "completed" ? `Ending: ${j.endingTitle}` : `In progress · Chapter ${j.chapter ?? 1}: ${j.scene}`}
                  </span>
                  <span className="text-zinc-500">{j.updatedAt.toLocaleDateString("en-GB")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
