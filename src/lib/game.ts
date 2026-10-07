import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getAuthenticatedPlayerId } from "@/lib/auth";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  gemTransactions,
  nodeChoices,
  players,
  playthroughSteps,
  playthroughs,
  stories,
  storyNodes,
} from "@/db/schema";
import { applyEffects, checkCond, initialState, REL_LABELS, renderBlocks, resolveRoutes } from "./engine";
import type { BondView, GameView } from "./view";
import type { GameState, StoryMeta } from "@/stories/types";

export const STARTER_GEMS = 60;

type StoryRow = typeof stories.$inferSelect;
type NodeRow = typeof storyNodes.$inferSelect;
type ChoiceRow = typeof nodeChoices.$inferSelect;
type PlaythroughRow = typeof playthroughs.$inferSelect;
export type GNode = NodeRow & { choices: ChoiceRow[] };
export type Graph = Map<string, GNode>;

/* ------------------------------------------------------------------ */
/* Players & wallet                                                     */
/* ------------------------------------------------------------------ */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPlayerId(): Promise<string | null> {
  return getAuthenticatedPlayerId();
}

/** Returns the signed-in player's id, or null when nobody is signed in. Guest players no longer exist. */
export async function ensurePlayerId(): Promise<string | null> {
  await ensureSeeded();
  return getAuthenticatedPlayerId();
}

export async function getGems(playerId: string | null): Promise<number> {
  if (!playerId) return STARTER_GEMS;
  const [row] = await db.select({ gems: players.gems }).from(players).where(eq(players.id, playerId));
  return row?.gems ?? STARTER_GEMS;
}

/* ------------------------------------------------------------------ */
/* Story loading                                                        */
/* ------------------------------------------------------------------ */

export async function listStories(): Promise<StoryRow[]> {
  await ensureSeeded();
  return db.select().from(stories).where(eq(stories.status, "published")).orderBy(asc(stories.sortOrder));
}

export async function getStoryBySlug(slug: string): Promise<StoryRow | null> {
  await ensureSeeded();
  const [row] = await db.select().from(stories).where(eq(stories.slug, slug));
  return row ?? null;
}

export async function loadGraph(storyId: number): Promise<Graph> {
  const nodes = await db.select().from(storyNodes).where(eq(storyNodes.storyId, storyId));
  const choices = nodes.length
    ? await db
        .select()
        .from(nodeChoices)
        .where(inArray(nodeChoices.nodeId, nodes.map((n) => n.id)))
        .orderBy(asc(nodeChoices.sortOrder))
    : [];
  const graph: Graph = new Map();
  for (const n of nodes) graph.set(n.nodeKey, { ...n, choices: [] });
  const byId = new Map(nodes.map((n) => [n.id, n.nodeKey]));
  for (const c of choices) graph.get(byId.get(c.nodeId)!)?.choices.push(c);
  return graph;
}

/** Endings the player has reached (across completed playthroughs) for a story. */
export async function getEndingsFound(playerId: string | null, storyId: number): Promise<Set<string>> {
  if (!playerId) return new Set();
  const rows = await db
    .selectDistinct({ key: playthroughs.endingKey })
    .from(playthroughs)
    .where(and(eq(playthroughs.playerId, playerId), eq(playthroughs.storyId, storyId), eq(playthroughs.status, "completed")));
  return new Set(rows.map((r) => r.key).filter((k): k is string => !!k));
}

export async function listPlaythroughs(playerId: string | null) {
  if (!playerId) return [];
  return db
    .select({
      id: playthroughs.id,
      status: playthroughs.status,
      endingKey: playthroughs.endingKey,
      updatedAt: playthroughs.updatedAt,
      slug: stories.slug,
      title: stories.title,
      coverFrom: stories.coverFrom,
      coverTo: stories.coverTo,
      coverImage: stories.coverImageUrl,
      chapterCount: stories.chapterCount,
      scene: storyNodes.sceneTitle,
      chapter: storyNodes.chapterNumber,
      endingTitle: storyNodes.endingTitle,
    })
    .from(playthroughs)
    .innerJoin(stories, eq(stories.id, playthroughs.storyId))
    .leftJoin(
      storyNodes,
      and(eq(storyNodes.storyId, playthroughs.storyId), eq(storyNodes.nodeKey, playthroughs.currentNodeKey)),
    )
    .where(eq(playthroughs.playerId, playerId))
    .orderBy(desc(playthroughs.updatedAt));
}

/* ------------------------------------------------------------------ */
/* Playthroughs                                                         */
/* ------------------------------------------------------------------ */

export async function startPlaythrough(playerId: string, slug: string): Promise<string | null> {
  const story = await getStoryBySlug(slug);
  if (!story) return null;
  const graph = await loadGraph(story.id);
  const start = [...graph.values()].find((n) => n.isStart);
  if (!start) return null;
  const state = initialState(story.meta);
  const first = resolveRoutes((k) => graph.get(k), start.nodeKey, state);
  const firstNode = graph.get(first);
  if (!firstNode || firstNode.routes?.length) return null;
  const [row] = await db
    .insert(playthroughs)
    .values({ playerId, storyId: story.id, currentNodeKey: first, state })
    .returning({ id: playthroughs.id });
  return row.id;
}

function buildBonds(meta: StoryMeta, state: GameState): BondView[] {
  return meta.characters.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    color: c.color,
    role: c.role,
    blurb: c.blurb,
    stats: c.rel.map((r) => {
      const value = state.rel[c.id]?.[r] ?? 0;
      const info = REL_LABELS[r] ?? { label: r, icon: "•" };
      return { label: info.label, icon: info.icon, pct: Math.round((Math.max(0, Math.min(10, value)) / 10) * 100) };
    }),
  }));
}

export async function getView(playthroughId: string, playerId: string | null): Promise<GameView | null> {
  if (!playerId || !UUID.test(playthroughId)) return null;
  const [pt] = await db
    .select()
    .from(playthroughs)
    .where(and(eq(playthroughs.id, playthroughId), eq(playthroughs.playerId, playerId)));
  if (!pt) return null;
  const [story] = await db.select().from(stories).where(eq(stories.id, pt.storyId));
  if (!story) return null;
  const graph = await loadGraph(story.id);
  const gems = await getGems(playerId);
  return buildView(pt, story, graph, gems);
}

async function buildView(pt: PlaythroughRow, story: StoryRow, graph: Graph, gems: number): Promise<GameView> {
  const node = graph.get(pt.currentNodeKey);
  if (!node) throw new Error(`Missing node ${pt.currentNodeKey}`);
  const meta = story.meta;
  const state = pt.state;

  const steps = await db
    .select()
    .from(playthroughSteps)
    .where(eq(playthroughSteps.playthroughId, pt.id))
    .orderBy(asc(playthroughSteps.stepNumber));

  const choices = node.choices
    .map((c) => {
      const met = checkCond(state, c.conditions);
      return { c, met };
    })
    .filter(({ c, met }) => met || !c.hideWhenLocked)
    .map(({ c, met }) => ({
      key: c.choiceKey,
      text: c.choiceText,
      premium: c.isPremium,
      price: c.priceGems,
      locked: !met,
      lockReason: !met ? (c.lockReason ?? "Something in your past choices closes this door.") : undefined,
    }));

  const flags = state.flags
    .map((f) => (meta.flags[f] ? { label: meta.flags[f].label, secret: !!meta.flags[f].secret } : null))
    .filter((f): f is { label: string; secret: boolean } => !!f);

  let ending: GameView["ending"] = null;
  if (node.isEnding) {
    const found = await getEndingsFound(pt.playerId, story.id);
    found.add(node.nodeKey);
    const endingNodes = [...graph.values()]
      .filter((n) => n.isEnding)
      .sort((a, b) => (a.endingNumber ?? 0) - (b.endingNumber ?? 0));
    ending = {
      number: node.endingNumber ?? 0,
      title: node.endingTitle ?? node.sceneTitle,
      type: (node.endingType ?? "neutral") as NonNullable<GameView["ending"]>["type"],
      majorChoices: steps.filter((s) => s.isMajor).length,
      secretsFound: state.flags.filter((f) => meta.flags[f]?.secret).length,
      secretsTotal: Object.values(meta.flags).filter((f) => f.secret).length,
      premiumUsed: steps.filter((s) => s.isPremium).length,
      gemsSpent: state.gemsSpent,
      endingsFound: found.size,
      endingsTotal: endingNodes.length,
      endings: endingNodes.map((n) => ({
        key: n.nodeKey,
        title: found.has(n.nodeKey) ? n.endingTitle : null,
        found: found.has(n.nodeKey),
        current: n.nodeKey === node.nodeKey,
      })),
    };
  }

  const trail: { chapter: number; scene: GameView["earlier"][number] }[] = [];
  let replay: GameState = initialState(meta);
  for (const s of steps) {
    const from = graph.get(s.fromNodeKey);
    if (!from) {
      trail.length = 0;
      break;
    }
    trail.push({
      chapter: from.chapterNumber,
      scene: {
        key: from.nodeKey,
        title: from.sceneTitle,
        blocks: renderBlocks(from.content, replay, meta.characters),
        choice: s.choiceText,
      },
    });
    const used = from.choices.find((c) => c.choiceKey === s.choiceKey);
    replay = applyEffects(replay, used?.effects);
  }
  const earlier: GameView["earlier"] = [];
  for (let i = trail.length - 1; i >= 0 && trail[i].chapter === node.chapterNumber; i--) earlier.unshift(trail[i].scene);

  const shifted = (state.shifted ?? [])
    .map((id) => meta.characters.find((c) => c.id === id)?.name)
    .filter((n): n is string => !!n);

  return {
    id: pt.id,
    slug: story.slug,
    storyTitle: story.title,
    coverFrom: story.coverFrom,
    coverTo: story.coverTo,
    coverImage: story.coverImageUrl,
    status: pt.status === "completed" ? "completed" : "active",
    gems,
    chapter: node.chapterNumber,
    totalChapters: story.chapterCount,
    node: { key: node.nodeKey, title: node.sceneTitle, blocks: renderBlocks(node.content, state, meta.characters) },
    earlier,
    choices,
    notice: { echo: state.echo ?? null, shifted },
    bonds: buildBonds(meta, state),
    traits: meta.stats.map((s) => ({ label: s.label, value: Math.max(0, state.stats[s.id] ?? 0) })),
    journal: { flags, items: state.items.map((i) => meta.items[i]).filter(Boolean) },
    history: steps.map((s) => {
      const from = graph.get(s.fromNodeKey);
      return {
        step: s.stepNumber,
        chapter: from?.chapterNumber ?? 0,
        scene: from?.sceneTitle ?? "",
        choice: s.choiceText,
        premium: s.isPremium,
        major: s.isMajor,
      };
    }),
    ending,
  };
}

export type ChooseResult =
  | { ok: true; view: GameView; rewards: { amount: number; description: string }[] }
  | { ok: false; status: number; error: string; needGems?: number };

export async function makeChoice(playthroughId: string, playerId: string, choiceKey: string): Promise<ChooseResult> {
  if (!UUID.test(playthroughId)) return { ok: false, status: 404, error: "Playthrough not found" };
  const [ptPreview] = await db
    .select({ storyId: playthroughs.storyId })
    .from(playthroughs)
    .where(and(eq(playthroughs.id, playthroughId), eq(playthroughs.playerId, playerId)));
  if (!ptPreview) return { ok: false, status: 404, error: "Playthrough not found" };
  const graph = await loadGraph(ptPreview.storyId);

  const outcome = await db.transaction(async (tx): Promise<ChooseResult | { ok: true; pt: PlaythroughRow; rewards: { amount: number; description: string }[] }> => {
    const [pt] = await tx
      .select()
      .from(playthroughs)
      .where(and(eq(playthroughs.id, playthroughId), eq(playthroughs.playerId, playerId)))
      .for("update");
    if (!pt) return { ok: false, status: 404, error: "Playthrough not found" };
    if (pt.status !== "active") return { ok: false, status: 409, error: "This story has already ended." };

    const node = graph.get(pt.currentNodeKey);
    const choice = node?.choices.find((c) => c.choiceKey === choiceKey);
    if (!node || !choice) return { ok: false, status: 400, error: "That choice isn't available here." };
    if (!checkCond(pt.state, choice.conditions))
      return { ok: false, status: 403, error: choice.lockReason ?? "That choice is locked." };

    const preview = applyEffects(pt.state, choice.effects);
    const dest = graph.get(resolveRoutes((k) => graph.get(k), choice.targetNodeKey, preview));
    if (!dest || dest.routes?.length) {
      return { ok: false, status: 500, error: "Story graph is broken (missing or unresolved node)." };
    }

    let spent = 0;
    if (choice.isPremium && choice.priceGems > 0) {
      const paid = await tx
        .update(players)
        .set({ gems: sql`${players.gems} - ${choice.priceGems}` })
        .where(and(eq(players.id, playerId), sql`${players.gems} >= ${choice.priceGems}`))
        .returning({ gems: players.gems });
      if (!paid.length) {
        const have = await tx.select({ gems: players.gems }).from(players).where(eq(players.id, playerId));
        return {
          ok: false,
          status: 402,
          error: "Not enough gems for this choice.",
          needGems: choice.priceGems - (have[0]?.gems ?? 0),
        };
      }
      spent = choice.priceGems;
      await tx.insert(gemTransactions).values({
        playerId,
        amount: -spent,
        kind: "spend",
        description: `Premium choice: ${choice.choiceText.slice(0, 80)}`,
        playthroughId,
      });
    }

    let state = applyEffects(pt.state, choice.effects);
    state.gemsSpent += spent;
    state.echo = choice.echo ?? null;
    state.shifted = Object.keys(choice.effects?.d ?? {})
      .filter((k) => k.includes("."))
      .map((k) => k.split(".")[0])
      .filter((v, i, a) => a.indexOf(v) === i);

    const nextKey = resolveRoutes((k) => graph.get(k), choice.targetNodeKey, state);
    const next = graph.get(nextKey);
    if (!next) return { ok: false, status: 500, error: "Story graph is broken (missing node)." };

    const rewards: { amount: number; description: string }[] = [];
    const awardOnce = async (amount: number, kind: string, description: string, rewardKey: string) => {
      const [reward] = await tx
        .insert(gemTransactions)
        .values({ playerId, amount, kind, description, playthroughId, rewardKey })
        .onConflictDoNothing({ target: [gemTransactions.playerId, gemTransactions.rewardKey] })
        .returning({ id: gemTransactions.id });
      if (!reward) return;
      await tx.update(players).set({ gems: sql`${players.gems} + ${amount}` }).where(eq(players.id, playerId));
      rewards.push({ amount, description });
    };

    if (next.isEnding || next.chapterNumber > node.chapterNumber) {
      await awardOnce(1, "chapter", `Chapter ${node.chapterNumber} completed`, `chapter:${pt.storyId}:${node.chapterNumber}`);
    }
    if (next.isEnding) {
      const [completedStory] = await tx.select({ title: stories.title }).from(stories).where(eq(stories.id, pt.storyId));
      await awardOnce(5, "story_completion", `Completed ${completedStory.title}`, `story:${pt.storyId}:completed`);
    }

    const [{ count }] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(playthroughSteps)
      .where(eq(playthroughSteps.playthroughId, pt.id));
    await tx.insert(playthroughSteps).values({
      playthroughId: pt.id,
      stepNumber: count + 1,
      fromNodeKey: node.nodeKey,
      toNodeKey: nextKey,
      choiceKey: choice.choiceKey,
      choiceText: choice.choiceText,
      isPremium: choice.isPremium,
      isMajor: choice.isMajor,
      gemsSpent: spent,
    });

    const now = new Date();
    const [updated] = await tx
      .update(playthroughs)
      .set({
        state,
        currentNodeKey: nextKey,
        status: next.isEnding ? "completed" : "active",
        endingKey: next.isEnding ? nextKey : null,
        updatedAt: now,
        completedAt: next.isEnding ? now : null,
      })
      .where(eq(playthroughs.id, pt.id))
      .returning();
    return { ok: true, pt: updated, rewards };
  });

  if (!outcome.ok || !("pt" in outcome)) return outcome as ChooseResult;
  const [story] = await db.select().from(stories).where(eq(stories.id, outcome.pt.storyId));
  const gems = await getGems(playerId);
  return { ok: true, view: await buildView(outcome.pt, story, graph, gems), rewards: outcome.rewards };
}

/* ------------------------------------------------------------------ */
/* Gems                                                                 */
/* ------------------------------------------------------------------ */

export const GEM_PACKS = [
  { id: "small", gems: 50, label: "Pocketful", blurb: "A few secret scenes" },
  { id: "medium", gems: 150, label: "Satchel", blurb: "Plenty for a full replay" },
  { id: "large", gems: 400, label: "Treasure chest", blurb: "Unlock everything" },
] as const;

export const DAILY_GEMS = 5;

export async function claimDaily(playerId: string): Promise<{ ok: boolean; message: string; gems: number }> {
  return db.transaction(async (tx) => {
    const [p] = await tx.select().from(players).where(eq(players.id, playerId)).for("update");
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const claimedToday = p.lastDailyClaim?.toISOString().slice(0, 10) === today;
    if (claimedToday) {
      return { ok: false, message: "Your daily reward is already claimed.", gems: p.gems };
    }
    const description = "Daily login reward";
    const [reward] = await tx
      .insert(gemTransactions)
      .values({ playerId, amount: DAILY_GEMS, kind: "daily", description, rewardKey: `daily:${today}` })
      .onConflictDoNothing({ target: [gemTransactions.playerId, gemTransactions.rewardKey] })
      .returning({ id: gemTransactions.id });
    if (!reward) return { ok: false, message: "Your daily reward is already claimed.", gems: p.gems };
    const [u] = await tx
      .update(players)
      .set({ gems: p.gems + DAILY_GEMS, lastDailyClaim: now })
      .where(eq(players.id, playerId))
      .returning({ gems: players.gems });
    return { ok: true, message: `+${DAILY_GEMS} gems added.`, gems: u.gems };
  });
}

export async function listTransactions(playerId: string | null) {
  if (!playerId) return [];
  return db
    .select()
    .from(gemTransactions)
    .where(eq(gemTransactions.playerId, playerId))
    .orderBy(desc(gemTransactions.createdAt), desc(gemTransactions.id))
    .limit(30);
}

export async function lastDailyClaim(playerId: string | null): Promise<Date | null> {
  if (!playerId) return null;
  const [p] = await db.select({ d: players.lastDailyClaim }).from(players).where(eq(players.id, playerId));
  return p?.d ?? null;
}

export function canClaimDaily(lastClaim: Date | null, now = new Date()) {
  return !lastClaim || lastClaim.toISOString().slice(0, 10) !== now.toISOString().slice(0, 10);
}
