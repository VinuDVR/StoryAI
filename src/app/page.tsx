import Link from "next/link";
import StoryCard from "@/components/StoryCard";
import { Cover } from "@/components/StoryCard";
import { getPlayerId, listPlaythroughs, listStories } from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const { genre } = await searchParams;
  const playerId = await getPlayerId();
  const [stories, journeys] = await Promise.all([listStories(), listPlaythroughs(playerId)]);

  const genres = [...new Set(stories.flatMap((s) => s.genres))].sort();
  const shown = genre ? stories.filter((s) => s.genres.includes(genre)) : stories;

  const active = journeys.filter((j) => j.status === "active");
  const foundBySlug = new Map<string, Set<string>>();
  for (const j of journeys) {
    if (j.status === "completed" && j.endingKey) {
      if (!foundBySlug.has(j.slug)) foundBySlug.set(j.slug, new Set());
      foundBySlug.get(j.slug)!.add(j.endingKey);
    }
  }
  const totalEndings = stories.reduce((n, s) => n + s.endingCount, 0);
  const totalFound = [...foundBySlug.values()].reduce((n, s) => n + s.size, 0);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(139,92,246,0.35),transparent),radial-gradient(700px_400px_at_90%_10%,rgba(236,72,153,0.25),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
          <p className="fade-up text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">Interactive stories</p>
          <h1 className="font-story fade-up-2 mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-white sm:text-7xl">
            Every choice leaves a mark.
          </h1>
          <p className="fade-up-3 mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Become the protagonist. Earn trust, tell lies, keep secrets. The people in these stories remember what you did, and the ending
            you get is the one you built.
          </p>
          <div className="fade-up-3 mt-8 flex flex-wrap gap-3">
            <a href="#stories" className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 hover:brightness-110">
              Choose a story
            </a>
            <span className="rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-400">
              {stories.length} stories · {totalEndings} endings{totalFound > 0 ? ` · ${totalFound} found` : ""}
            </span>
          </div>
        </div>
      </section>

      {active.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-4">
          <h2 className="font-story text-2xl font-semibold text-white">Continue your story</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {active.slice(0, 4).map((j) => (
              <Link
                key={j.id}
                href={`/play/${j.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/25"
              >
                <Cover from={j.coverFrom} to={j.coverTo} emoji="📖" image={j.coverImage} className="h-20 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{j.title}</p>
                  <p className="truncate text-sm text-zinc-400">
                    Chapter {j.chapter ?? 1} · {j.scene}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                      style={{ width: `${Math.min(100, Math.round(((j.chapter ?? 1) / Math.max(1, j.chapterCount)) * 100))}%` }}
                    />
                  </div>
                </div>
                <span className="pr-2 text-sm text-violet-300 group-hover:translate-x-0.5">Resume →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="stories" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-story text-3xl font-semibold text-white">Discover</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`rounded-full border px-3.5 py-1.5 text-sm ${!genre ? "border-violet-400 bg-violet-400/15 text-white" : "border-white/10 text-zinc-400 hover:text-white"}`}
            >
              All
            </Link>
            {genres.map((g) => (
              <Link
                key={g}
                href={`/?genre=${encodeURIComponent(g)}`}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${genre === g ? "border-violet-400 bg-violet-400/15 text-white" : "border-white/10 text-zinc-400 hover:text-white"}`}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <StoryCard key={s.slug} story={s} found={foundBySlug.get(s.slug)?.size ?? 0} />
          ))}
        </div>
        {shown.length === 0 && <p className="mt-8 text-zinc-500">No stories in this genre yet.</p>}
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-5 px-6 md:grid-cols-3">
        {[
          ["🦋", "The butterfly effect", "A lie in chapter two can close a door in chapter eleven. Characters keep track, even when you don't."],
          ["❤️", "Relationships, not points", "Trust, affection and respect move separately. Someone can trust you completely and still not love you."],
          ["💎", "Extra, never required", "Premium choices open secret scenes and alternate routes. Every story can be finished, in full, for free."],
        ].map(([icon, title, body]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-3xl">{icon}</p>
            <h3 className="font-story mt-3 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
