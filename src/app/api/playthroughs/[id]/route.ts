import { NextResponse } from "next/server";
import { getPlayerId, getView } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const view = await getView(id, await getPlayerId());
  if (!view) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ view });
}
