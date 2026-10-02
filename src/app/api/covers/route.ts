import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { generateCoverImage } from "@/lib/cover-generator";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const allStories = await db.select().from(stories);
    const failed: string[] = [];
    let generated = 0;
    let skipped = 0;

    for (const story of allStories) {
      const currentPath = story.coverImageUrl?.startsWith("/covers/")
        ? path.join(process.cwd(), "public", story.coverImageUrl.slice(1))
        : null;
      if (currentPath && existsSync(currentPath)) {
        skipped++;
        continue;
      }

      const coverImageUrl = await generateCoverImage({
        title: story.title,
        description: story.description,
        genres: story.genres,
        fallbackUrl: story.coverImageUrl ?? "",
      });

      const generatedPath = coverImageUrl.startsWith("/covers/")
        ? path.join(process.cwd(), "public", coverImageUrl.slice(1))
        : null;
      if (!generatedPath || !existsSync(generatedPath)) {
        failed.push(story.slug);
        continue;
      }

      await db.update(stories).set({ coverImageUrl }).where(eq(stories.id, story.id));
      generated++;
    }

    return NextResponse.json(
      { ok: failed.length === 0, generated, skipped, failed },
      { status: failed.length ? 502 : 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}