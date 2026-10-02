import { NextResponse } from "next/server";
import { getPlayerId, getView, makeChoice } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const view = await getView(id, await getPlayerId());
  if (!view) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ view });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const playerId = await getPlayerId();
  if (!playerId) return NextResponse.json({ error: "No active player" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { choice?: string };
  if (!body.choice) return NextResponse.json({ error: "choice is required" }, { status: 400 });
  const result = await makeChoice(id, playerId, body.choice);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, needGems: result.needGems }, { status: result.status });
  }
  return NextResponse.json({ view: result.view, rewards: result.rewards });
}
