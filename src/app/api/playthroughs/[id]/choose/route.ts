import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  playthroughs,
  storyNodes,
  nodeChoices,
  playthroughSteps,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  applyEffects,
  checkConditions,
} from "@/lib/game-engine";
import type { ChoiceEffects, NodeConditions, PlaythroughState } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ptId = parseInt(id, 10);
  const body = await req.json();
  const { choiceKey } = body as { choiceKey: string };

  // Load playthrough
  const [pt] = await db
    .select()
    .from(playthroughs)
    .where(eq(playthroughs.id, ptId));

  if (!pt) return NextResponse.json({ error: "Playthrough not found" }, { status: 404 });
  if (pt.isCompleted) return NextResponse.json({ error: "Story already completed" }, { status: 400 });

  // Load current node
  const [currentNode] = await db
    .select()
    .from(storyNodes)
    .where(
      and(
        eq(storyNodes.storyId, pt.storyId),
        eq(storyNodes.nodeKey, pt.currentNodeKey)
      )
    );

  if (!currentNode) return NextResponse.json({ error: "Current node not found" }, { status: 404 });

  // Load available choices for this node
  const allChoices = await db
    .select()
    .from(nodeChoices)
    .where(eq(nodeChoices.nodeId, currentNode.id));

  const choice = allChoices.find((c) => c.choiceKey === choiceKey);
  if (!choice) return NextResponse.json({ error: "Choice not found" }, { status: 404 });

  const currentState = pt.state as PlaythroughState;

  // Check if choice conditions are met
  const conditionsMet = checkConditions(
    currentState,
    choice.conditions as NodeConditions | null
  );
  if (!conditionsMet) {
    return NextResponse.json(
      { error: "Conditions not met for this choice" },
      { status: 400 }
    );
  }

  // Handle premium choices
  if (choice.isPremium) {
    if (pt.gemsBalance < choice.priceGems) {
      return NextResponse.json(
        { error: "Insufficient gems", gemsBalance: pt.gemsBalance, required: choice.priceGems },
        { status: 402 }
      );
    }
  }

  // Apply effects
  const effects = (choice.effects ?? {}) as ChoiceEffects;
  const newState = applyEffects(currentState, effects);

  // Find target node
  const [targetNode] = await db
    .select()
    .from(storyNodes)
    .where(
      and(
        eq(storyNodes.storyId, pt.storyId),
        eq(storyNodes.nodeKey, choice.targetNodeKey)
      )
    );

  if (!targetNode) {
    return NextResponse.json({ error: "Target node not found" }, { status: 404 });
  }

  const isEnding = targetNode.isEnding;
  const gemsSpent = choice.isPremium ? choice.priceGems : 0;

  // Record step
  await db.insert(playthroughSteps).values({
    playthroughId: ptId,
    nodeKey: currentNode.nodeKey,
    choiceKey: choice.choiceKey,
    choiceText: choice.choiceText,
    effectsApplied: effects,
    stateBefore: currentState,
    stateAfter: newState,
    chapterNumber: currentNode.chapterNumber,
  });

  // Update playthrough
  const [updatedPt] = await db
    .update(playthroughs)
    .set({
      currentNodeKey: targetNode.nodeKey,
      state: newState,
      isCompleted: isEnding,
      endingKey: isEnding ? targetNode.nodeKey : pt.endingKey,
      gemsBalance: pt.gemsBalance - gemsSpent,
      gemsSpent: pt.gemsSpent + gemsSpent,
      updatedAt: new Date(),
    })
    .where(eq(playthroughs.id, ptId))
    .returning();

  // Get choices for next node (if not ending)
  const nextChoices = isEnding
    ? []
    : await db
        .select()
        .from(nodeChoices)
        .where(eq(nodeChoices.nodeId, targetNode.id))
        .orderBy(nodeChoices.sortOrder);

  return NextResponse.json({
    playthrough: updatedPt,
    node: targetNode,
    choices: nextChoices,
    effectsApplied: effects,
    isEnding,
  });
}
