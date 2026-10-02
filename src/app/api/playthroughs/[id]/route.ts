import { NextResponse } from "next/server";
import { db } from "@/db";
import { playthroughs, storyNodes, nodeChoices, playthroughSteps } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ptId = parseInt(id, 10);

  const [pt] = await db
    .select()
    .from(playthroughs)
    .where(eq(playthroughs.id, ptId));

  if (!pt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [node] = await db
    .select()
    .from(storyNodes)
    .where(
      and(
        eq(storyNodes.storyId, pt.storyId),
        eq(storyNodes.nodeKey, pt.currentNodeKey)
      )
    );

  const choices = node
    ? await db
        .select()
        .from(nodeChoices)
        .where(eq(nodeChoices.nodeId, node.id))
        .orderBy(nodeChoices.sortOrder)
    : [];

  const steps = await db
    .select()
    .from(playthroughSteps)
    .where(eq(playthroughSteps.playthroughId, ptId))
    .orderBy(playthroughSteps.id);

  return NextResponse.json({ playthrough: pt, node, choices, steps });
}
