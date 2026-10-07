import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { nodeChoices, stories, storyNodes } from "@/db/schema";
import { normalize } from "@/stories/dsl";
import { validateStory } from "@/lib/validate";
import { STORIES } from "@/stories";
import type { StoryDef, StoryMeta } from "@/stories/types";

const g = globalThis as typeof globalThis & { __swSeed?: Promise<void> };

const hashOf = (def: StoryDef) => createHash("md5").update(JSON.stringify(def)).digest("hex");

async function seed() {
  const existing = await db.select({ slug: stories.slug, hash: stories.contentHash }).from(stories);
  const current = new Map(existing.map((e) => [e.slug, e.hash]));

  for (let idx = 0; idx < STORIES.length; idx++) {
    const def = STORIES[idx];
    const hash = hashOf(def);
    if (current.get(def.slug) === hash) continue;

    const report = validateStory(def, 0);
    if (report.errors.length) {
      console.error(`Story "${def.slug}" failed validation and was not published:`, report.errors);
      continue;
    }
    const nodes = normalize(def);
    const premium = nodes.some((n) => n.choices.some((c) => c.gems));
    const chapters = Math.max(...nodes.filter((n) => !n.routes?.length).map((n) => n.ch));
    const meta: StoryMeta = {
      setting: def.setting,
      tone: def.tone,
      stats: def.stats,
      initial: def.initial ?? {},
      characters: def.characters,
      flags: def.flags,
      items: def.items ?? {},
    };
    const values = {
      slug: def.slug,
      title: def.title,
      tagline: def.tagline,
      description: def.description,
      coverImageUrl: def.cover.image ?? null,
      coverFrom: def.cover.from,
      coverTo: def.cover.to,
      coverEmoji: def.cover.emoji,
      genres: def.genres,
      ageRating: def.rating,
      isPremium: premium,
      status: "published",
      chapterCount: chapters,
      endingCount: nodes.filter((n) => n.ending).length,
      sortOrder: idx,
      meta,
      contentHash: hash,
    };

    await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(stories)
        .values(values)
        .onConflictDoUpdate({ target: stories.slug, set: values })
        .returning({ id: stories.id });
      await tx.delete(storyNodes).where(eq(storyNodes.storyId, row.id));

      const inserted = await tx
        .insert(storyNodes)
        .values(
          nodes.map((n) => ({
            storyId: row.id,
            nodeKey: n.key,
            chapterNumber: n.ch,
            sceneTitle: n.title,
            content: n.text,
            isStart: !!n.start,
            isEnding: !!n.ending,
            endingType: n.ending?.type ?? null,
            endingNumber: n.ending?.n ?? null,
            endingTitle: n.ending?.title ?? null,
            conditions: null,
            routes: n.routes ?? null,
          })),
        )
        .returning({ id: storyNodes.id, key: storyNodes.nodeKey });
      const idByKey = new Map(inserted.map((r) => [r.key, r.id]));

      const choiceRows = nodes.flatMap((n) =>
        n.choices.map((c, i) => ({
          nodeId: idByKey.get(n.key)!,
          choiceKey: c.k,
          choiceText: c.t,
          targetNodeKey: c.to,
          sortOrder: i,
          isPremium: !!c.gems,
          priceGems: c.gems ?? 0,
          conditions: c.req ?? null,
          effects: c.fx ?? null,
          isMajor: !!c.major,
          echo: c.echo ?? null,
          lockReason: c.lock ?? null,
          hideWhenLocked: !!c.hide,
        })),
      );
      if (choiceRows.length) await tx.insert(nodeChoices).values(choiceRows);
    });
  }
}

/** Idempotent: publishes/updates built-in stories whenever their content changes. */
export function ensureSeeded(): Promise<void> {
  if (!g.__swSeed) {
    g.__swSeed = seed().catch((err) => {
      g.__swSeed = undefined;
      throw err;
    });
  }
  return g.__swSeed;
}
