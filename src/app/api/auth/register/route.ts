import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gemTransactions, players } from "@/db/schema";
import { createPlayerSession, hashPassword } from "@/lib/auth";
import { claimDaily, DAILY_GEMS, getPlayerId, STARTER_GEMS } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: unknown;
    password?: unknown;
    displayName?: unknown;
  };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });
  }
  if (displayName.length > 40) {
    return NextResponse.json({ error: "Display name must be 40 characters or fewer." }, { status: 400 });
  }

  const [existingAccount] = await db.select({ id: players.id }).from(players).where(eq(players.email, email));
  if (existingAccount) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const guestId = await getPlayerId();
  const [guest] = guestId
    ? await db.select().from(players).where(eq(players.id, guestId))
    : [];
  if (guest?.email || guest?.passwordHash) {
    return NextResponse.json({ error: "Sign out before creating another account." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  let playerId: string;
  try {
    if (guest) {
      const [updated] = await db
        .update(players)
        .set({ email, passwordHash, displayName: displayName || null })
        .where(eq(players.id, guest.id))
        .returning({ id: players.id });
      playerId = updated.id;
    } else {
      const [created] = await db
        .insert(players)
        .values({ email, passwordHash, displayName: displayName || null })
        .returning({ id: players.id });
      playerId = created.id;
      await db.insert(gemTransactions).values({
        playerId,
        amount: STARTER_GEMS,
        kind: "welcome",
        description: "Welcome gift",
      });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    throw error;
  }

  await createPlayerSession(playerId);
  const dailyReward = await claimDaily(playerId);
  return NextResponse.json({ ok: true, dailyReward: dailyReward.ok ? DAILY_GEMS : 0 });
}