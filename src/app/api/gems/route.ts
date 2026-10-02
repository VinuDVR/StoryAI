import { NextResponse } from "next/server";
import { claimDaily, ensurePlayerId } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { action?: string; pack?: string };
  const playerId = await ensurePlayerId();
  if (body.action === "daily") {
    const res = await claimDaily(playerId);
    return NextResponse.json(res, { status: res.ok ? 200 : 429 });
  }
  if (body.action === "pack") return NextResponse.json({ error: "Gem purchases are not available yet." }, { status: 503 });
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
