import { NextResponse } from "next/server";
import { ensurePlayerId, startPlaythrough } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { slug?: string };
  if (!body.slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  const playerId = await ensurePlayerId();
  if (!playerId) return NextResponse.json({ error: "Sign in to start a story." }, { status: 401 });
  const id = await startPlaythrough(playerId, body.slug);
  if (!id) return NextResponse.json({ error: "Story not found" }, { status: 404 });
  return NextResponse.json({ id });
}
