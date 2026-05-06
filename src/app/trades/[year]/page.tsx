export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTradesBySeason } from "@/lib/queries/trades";

type TradeSide = {
  id: string;
  players: string[];
  franchiseId: string;
  franchise: { id: string; slug: string; gmName: string };
};

function TradeCard({
  leftSide,
  rightSide,
  isVetoed,
  teamNames,
}: {
  leftSide: TradeSide;
  rightSide: TradeSide;
  isVetoed: boolean;
  teamNames: Record<string, string>;
}) {
  return (
    <div className={`card overflow-hidden ${isVetoed ? "opacity-60 border-red-900/50" : ""}`}>
      {isVetoed && (
        <div className="px-4 pt-3 pb-0">
          <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Vetoed</span>
        </div>
      )}
      <div className="grid grid-cols-2 divide-x divide-rink-700">
        <div className="p-4">
          <Link href={`/owners/${leftSide.franchise.slug}`} className="text-sm font-bold text-ice-50 uppercase tracking-wide hover:text-gold-400 transition-colors">
            {leftSide.franchise.gmName}
          </Link>
          {teamNames[leftSide.franchiseId] && (
            <div className="text-xs text-ice-300 mt-0.5">{teamNames[leftSide.franchiseId]}</div>
          )}
          <div className="text-xs text-ice-400 uppercase tracking-wider mb-2 mt-3">received</div>
          <div className="space-y-1">
            {rightSide.players.map((p) => (
              <div key={p} className="text-sm text-ice-100">{p}</div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <Link href={`/owners/${rightSide.franchise.slug}`} className="text-sm font-bold text-ice-50 uppercase tracking-wide hover:text-gold-400 transition-colors">
            {rightSide.franchise.gmName}
          </Link>
          {teamNames[rightSide.franchiseId] && (
            <div className="text-xs text-ice-300 mt-0.5">{teamNames[rightSide.franchiseId]}</div>
          )}
          <div className="text-xs text-ice-400 uppercase tracking-wider mb-2 mt-3">received</div>
          <div className="space-y-1">
            {leftSide.players.map((p) => (
              <div key={p} className="text-sm text-ice-100">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TradesSeasonPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const result = await getTradesBySeason(year);
  if (!result) notFound();

  const { season, trades, teamNames } = result;
  const isYahoo = season.platform === "YAHOO";
  const completedTrades = trades.filter((t) => !t.isVetoed);
  const vetoedTrades = trades.filter((t) => t.isVetoed);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/trades" className="text-ice-200 text-sm hover:text-ice-50 transition-colors">
          ← Trade History
        </Link>
        <h1 className="text-2xl font-bold text-ice-50 mt-2">{season.yearLabel} Trades</h1>
        <p className="text-ice-200 text-sm mt-1">
          {completedTrades.length} trades
          {vetoedTrades.length > 0 && ` · ${vetoedTrades.length} vetoed`}
        </p>
      </div>

      {isYahoo && (
        <div className="rounded-lg border border-gold-400/30 bg-gold-400/5 px-4 py-3 text-sm text-gold-300">
          <span className="font-semibold">Note:</span> Draft picks were tradeable on Yahoo and are
          not reflected in these records. Some trades may appear more one-sided than they actually were.
        </div>
      )}

      {trades.length === 0 ? (
        <p className="text-ice-200">No trades recorded for this season.</p>
      ) : (
        <div className="space-y-3">
          {completedTrades.map((trade) => {
            const [a, b] = trade.sides;
            if (!a || !b) return null;
            return <TradeCard key={trade.id} leftSide={a} rightSide={b} isVetoed={false} teamNames={teamNames} />;
          })}
          {vetoedTrades.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-ice-100 pt-4">Vetoed Trades</h2>
              {vetoedTrades.map((trade) => {
                const [a, b] = trade.sides;
                if (!a || !b) return null;
                return <TradeCard key={trade.id} leftSide={a} rightSide={b} isVetoed={true} teamNames={teamNames} />;
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
