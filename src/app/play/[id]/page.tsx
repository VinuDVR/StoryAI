import { notFound } from "next/navigation";
import Reader from "@/components/Reader";
import { getPlayerId, getView } from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = await getView(id, await getPlayerId());
  if (!view) notFound();
  return <Reader initial={view} />;
}
