import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { stories } from "@/db/schema";
import { ensurePlayerId, getPlayerId, listPlaythroughs, startPlaythrough } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { storyId?: unknown };
  const storyId = Number(body.storyId);

  if (!Number.isInteger(storyId) || storyId < 1) {
    return NextResponse.json({ error: "storyId required" }, { status: 400 });
  }

  const [story] = await db.select({ slug: stories.slug }).from(stories).where(eq(stories.id, storyId));
  if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });
  const playerId = await ensurePlayerId();
  const id = await startPlaythrough(playerId, story.slug);
  if (!id) return NextResponse.json({ error: "Story has no start node" }, { status: 404 });
  return NextResponse.json({ id, playthrough: { id } });
}

export async function GET() {
  return NextResponse.json(await listPlaythroughs(await getPlayerId()));
}
