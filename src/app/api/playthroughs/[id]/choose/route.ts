import { NextResponse } from "next/server";
import { getPlayerId, makeChoice } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const playerId = await getPlayerId();
  if (!playerId) return NextResponse.json({ error: "No active player" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { choiceKey?: unknown; choice?: unknown };
  const choiceKey = typeof body.choiceKey === "string" ? body.choiceKey : body.choice;
  if (typeof choiceKey !== "string" || !choiceKey) {
    return NextResponse.json({ error: "choiceKey is required" }, { status: 400 });
  }

  const result = await makeChoice(id, playerId, choiceKey);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, needGems: result.needGems }, { status: result.status });
  }
  return NextResponse.json({ view: result.view, rewards: result.rewards });
}