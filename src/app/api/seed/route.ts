import { NextResponse } from "next/server";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await ensureSeeded();
    return NextResponse.json({ ok: true, message: "Seed complete" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Seeding failed." }, { status: 500 });
  }
}
