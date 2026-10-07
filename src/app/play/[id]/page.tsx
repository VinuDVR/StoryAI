import { notFound, redirect } from "next/navigation";
import Reader from "@/components/Reader";
import { getPlayerId, getView } from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playerId = await getPlayerId();
  if (!playerId) redirect(`/account?next=${encodeURIComponent(`/play/${id}`)}`);
  const view = await getView(id, playerId);
  if (!view) notFound();
  return <Reader initial={view} />;
}
