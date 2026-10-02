import { NextResponse } from "next/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await db
    .select()
    .from(stories)
    .where(eq(stories.status, "published"))
    .orderBy(stories.id);
  return NextResponse.json(all);
}
