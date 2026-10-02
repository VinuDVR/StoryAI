import Link from "next/link";
import { UserRound } from "lucide-react";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getGems, getPlayerId } from "@/lib/game";

export default async function Header() {
  let gems = 0;
  let accountLabel = "Account";
  try {
    const playerId = await getPlayerId();
    gems = await getGems(playerId);
    if (playerId) {
      const [player] = await db
        .select({ displayName: players.displayName, email: players.email })
        .from(players)
        .where(eq(players.id, playerId));
      accountLabel = player?.displayName || player?.email?.split("@")[0] || "Account";
    }
  } catch {
    gems = 0;
  }
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0b0a12]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm">
            ✦
          </span>
          StoryWeave
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white">
            Discover
          </Link>
          <Link href="/account" className="flex max-w-36 items-center gap-1.5 truncate rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white">
            <UserRound className="h-4 w-4 shrink-0" />
            <span className="truncate">{accountLabel}</span>
          </Link>
          <Link href="/studio" className="hidden rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white sm:block">
            Studio
          </Link>
          <Link
            href="/gems"
            className="ml-2 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 font-medium text-amber-200 hover:bg-amber-400/20"
          >
            <span>💎</span>
            <span>{gems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
