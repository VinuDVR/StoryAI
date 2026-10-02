import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { players } from "@/db/schema";
import { createPlayerSession, verifyPassword } from "@/lib/auth";
import { claimDaily, DAILY_GEMS } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const [player] = await db.select().from(players).where(eq(players.email, email));

  if (!player?.passwordHash || !(await verifyPassword(password, player.passwordHash))) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  await createPlayerSession(player.id);
  const dailyReward = await claimDaily(player.id);
  return NextResponse.json({ ok: true, dailyReward: dailyReward.ok ? DAILY_GEMS : 0 });
}