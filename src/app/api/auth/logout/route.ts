import { NextResponse } from "next/server";
import { deletePlayerSession } from "@/lib/auth";

export async function POST() {
  await deletePlayerSession();
  return NextResponse.json({ ok: true });
}