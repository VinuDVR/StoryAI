import { NextResponse } from "next/server";
import { db } from "@/db";
import { playthroughs, storyNodes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createInitialState } from "@/lib/game-engine";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function getSessionId(cookieStore: Awaited<ReturnType<typeof cookies>>): string {
  let sid = cookieStore.get("sw_session")?.value;
  if (!sid) {
    sid = crypto.randomUUID();
  }
  return sid;
}

export async function POST(req: Request) {
  const body = await req.json();
  const storyId: number = body.storyId;

  if (!storyId) {
    return NextResponse.json({ error: "storyId required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sessionId = getSessionId(cookieStore);

  // Find start node
  const [startNode] = await db
    .select()
    .from(storyNodes)
    .where(and(eq(storyNodes.storyId, storyId), eq(storyNodes.isStart, true)));

  if (!startNode) {
    return NextResponse.json({ error: "Story has no start node" }, { status: 404 });
  }

  const initialState = createInitialState(storyId);

  const [pt] = await db
    .insert(playthroughs)
    .values({
      sessionId,
      storyId,
      currentNodeKey: startNode.nodeKey,
      state: initialState,
      gemsBalance: 50,
    })
    .returning();

  const response = NextResponse.json({ playthrough: pt, node: startNode });
  response.cookies.set("sw_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = getSessionId(cookieStore);

  const pts = await db
    .select()
    .from(playthroughs)
    .where(eq(playthroughs.sessionId, sessionId))
    .orderBy(playthroughs.updatedAt);

  return NextResponse.json(pts);
}
