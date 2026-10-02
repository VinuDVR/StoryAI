import GemShop from "@/components/GemShop";
import {
  DAILY_GEMS,
  GEM_PACKS,
  canClaimDaily,
  getGems,
  getPlayerId,
  lastDailyClaim,
  listTransactions,
} from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function GemsPage() {
  const playerId = await getPlayerId();
  const [gems, txs, last] = await Promise.all([getGems(playerId), listTransactions(playerId), lastDailyClaim(playerId)]);
  const canClaim = canClaimDaily(last);

  return (
    <main className="mx-auto max-w-3xl px-6 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Wallet</p>
      <h1 className="font-story mt-2 text-5xl font-semibold text-white">
        {gems} <span className="text-3xl">💎</span>
      </h1>
      <p className="mt-2 text-zinc-400">Gems open premium choices: secret scenes, extra clues and alternate routes.</p>
      <p className="mt-3 text-sm text-zinc-500">Earn 5 gems when you sign in each day, 1 gem the first time you finish each chapter, and 5 gems the first time you complete a story.</p>

      <div className="mt-8">
        <GemShop packs={GEM_PACKS.map((p) => ({ ...p }))} dailyGems={DAILY_GEMS} canClaim={canClaim} />
      </div>

      <h2 className="font-story mt-14 text-2xl font-semibold text-white">Transaction history</h2>
      <ul className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
        {txs.length === 0 && <li className="px-5 py-4 text-sm text-zinc-500">No transactions yet. Start a story to receive your welcome gems.</li>}
        {txs.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
            <span className="min-w-0">
              <span className="block truncate text-zinc-200">{t.description}</span>
              <span className="text-xs text-zinc-500">{t.createdAt.toLocaleString("en-GB")}</span>
            </span>
            <span className={`shrink-0 font-semibold ${t.amount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
              {t.amount >= 0 ? "+" : ""}
              {t.amount}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
