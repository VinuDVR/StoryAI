import { NextResponse } from "next/server";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await ensureSeeded();
    return NextResponse.json({ ok: true, message: "Seed complete" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
