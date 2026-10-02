import Link from "next/link";
import { BookOpen, Gem, Sparkles } from "lucide-react";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { playthroughSteps, playthroughs, players } from "@/db/schema";
import { getGems, getPlayerId, listPlaythroughs } from "@/lib/game";
import { Cover } from "@/components/StoryCard";
import AccountForm from "./AccountForm";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ dailyReward?: string }>;
}) {
  const { dailyReward } = await searchParams;
  const playerId = await getPlayerId();
  const [player] = playerId
    ? await db.select().from(players).where(eq(players.id, playerId))
    : [];

  if (!player?.email) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Player account</p>
        <h1 className="font-story mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-6xl">Your stories, wherever you go.</h1>
        <p className="mt-4 max-w-xl text-zinc-400">Create an account or sign in to keep your progress and gem balance together.</p>
        <div className="mt-10">
          <AccountForm />
        </div>
      </main>
    );
  }

  const [gems, journeys, aggregates] = await Promise.all([
    getGems(player.id),
    listPlaythroughs(player.id),
    db
      .select({
        choices: sql<number>`count(${playthroughSteps.id})::int`,
        majorChoices: sql<number>`count(*) filter (where ${playthroughSteps.isMajor})::int`,
        gemsSpent: sql<number>`coalesce(sum(${playthroughSteps.gemsSpent}), 0)::int`,
      })
      .from(playthroughs)
      .leftJoin(playthroughSteps, eq(playthroughSteps.playthroughId, playthroughs.id))
      .where(eq(playthroughs.playerId, player.id)),
  ]);
  const completed = journeys.filter((journey) => journey.status === "completed");
  const completedStories = new Set(completed.map((journey) => journey.slug)).size;
  const endingsFound = new Set(completed.filter((journey) => journey.endingKey).map((journey) => `${journey.slug}:${journey.endingKey}`)).size;
  const stats = aggregates[0] ?? { choices: 0, majorChoices: 0, gemsSpent: 0 };

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Player archive</p>
          <h1 className="font-story mt-3 text-4xl font-semibold text-white sm:text-5xl">{player.displayName || "Your account"}</h1>
          <p className="mt-2 text-zinc-400">{player.email}</p>
        </div>
        <LogoutButton />
      </div>
      {dailyReward === "1" && (
        <p role="status" className="mt-5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Daily login reward: +5 gems.
        </p>
      )}

      <dl className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 py-7 md:grid-cols-4">
        <div className="px-4 first:pl-0">
          <dt className="flex items-center gap-2 text-sm text-zinc-400"><Gem className="h-4 w-4 text-amber-300" /> Gem balance</dt>
          <dd className="mt-3 text-3xl font-semibold text-white">{gems}</dd>
        </div>
        <div className="px-4">
          <dt className="flex items-center gap-2 text-sm text-zinc-400"><BookOpen className="h-4 w-4 text-sky-300" /> Stories completed</dt>
          <dd className="mt-3 text-3xl font-semibold text-white">{completedStories}</dd>
        </div>
        <div className="px-4 pt-6 md:pt-0">
          <dt className="flex items-center gap-2 text-sm text-zinc-400"><Sparkles className="h-4 w-4 text-fuchsia-300" /> Endings discovered</dt>
          <dd className="mt-3 text-3xl font-semibold text-white">{endingsFound}</dd>
        </div>
        <div className="px-4 pt-6 md:pt-0">
          <dt className="text-sm text-zinc-400">Choices made</dt>
          <dd className="mt-3 text-3xl font-semibold text-white">{stats.choices}</dd>
          <p className="mt-1 text-xs text-zinc-500">{stats.majorChoices} major · {stats.gemsSpent} gems spent</p>
        </div>
      </dl>

      <section className="pt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-story text-2xl font-semibold text-white">Your journeys</h2>
            <p className="mt-1 text-sm text-zinc-500">Active playthroughs and completed endings.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-violet-300 hover:text-white">Browse stories</Link>
        </div>

        {journeys.length === 0 ? (
          <p className="mt-6 border-y border-white/10 py-8 text-sm text-zinc-400">No journeys yet. Choose a story to begin.</p>
        ) : (
          <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {journeys.slice(0, 12).map((journey) => (
              <li key={journey.id}>
                <Link href={journey.status === "active" ? `/play/${journey.id}` : `/story/${journey.slug}`} className="flex items-center gap-4 py-4 transition hover:bg-white/[0.025]">
                  <Cover from={journey.coverFrom} to={journey.coverTo} emoji="📖" image={journey.coverImage} className="h-20 w-16 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-white">{journey.title}</span>
                    <span className="mt-1 block truncate text-sm text-zinc-400">
                      {journey.status === "active" ? journey.scene || "In progress" : journey.endingTitle || "Completed"}
                    </span>
                  </span>
                  <span className={`shrink-0 text-xs ${journey.status === "completed" ? "text-emerald-300" : "text-violet-300"}`}>
                    {journey.status === "completed" ? "Completed" : "Continue"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}