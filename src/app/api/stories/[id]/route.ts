import { NextResponse } from "next/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = parseInt(id, 10);
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
  if (!story) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(story);
}
