export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTradesBySeason } from "@/lib/queries/trades";

function TradeCard({
  trade,
}: {
  trade: {
    id: string;
    isVetoed: boolean;
    sides: {
      id: string;
      players: string[];
      franchise: { id: string; slug: string; gmName: string };
    }[];
  };
  seasonTeamNames: Record<string, string>;
}) {
  return (
    <div
      className={`card p-5 space-y-4 ${
        trade.isVetoed ? "opacity-60 border-red-900" : ""
      }`}
    >
      {trade.isVetoed && (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-900/50 text-red-400 text-xs font-bold rounded uppercase tracking-wider">
          Vetoed
        </div>
      )}
      <div className="divide-y divide-rink-700">
        {trade.sides.map((side, i) => (
          <div key={side.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="text-xs text-ice-300 w-12 shrink-0 pt-0.5 font-medium">
                {i === 0 ? "gave" : "gave"}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/owners/${side.franchise.slug}`}
                  className="text-gold-400 text-sm font-semibold hover:underline"
                >
                  {side.franchise.gmName}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {side.players.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 bg-rink-700 text-ice-100 text-sm rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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

  const { season, trades } = result;
  const isYahoo = season.platform === "YAHOO";

  const completedTrades = trades.filter((t) => !t.isVetoed);
  const vetoedTrades = trades.filter((t) => t.isVetoed);

  // Build team name lookup from teamSeasons if needed — we use gmName directly
  const seasonTeamNames: Record<string, string> = {};

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/trades"
          className="text-ice-200 text-sm hover:text-ice-50 transition-colors"
        >
          ← Trade History
        </Link>
        <h1 className="text-2xl font-bold text-ice-50 mt-2">
          {season.yearLabel} Trades
        </h1>
        <p className="text-ice-200 text-sm mt-1">
          {completedTrades.length} trades
          {vetoedTrades.length > 0 && ` · ${vetoedTrades.length} vetoed`}
        </p>
      </div>

      {isYahoo && (
        <div className="rounded-lg border border-gold-400/30 bg-gold-400/5 px-4 py-3 text-sm text-gold-300">
          <span className="font-semibold">Note:</span> Draft picks were
          tradeable on Yahoo and are not reflected in these records. Some trades
          may appear more one-sided than they actually were.
        </div>
      )}

      {trades.length === 0 ? (
        <p className="text-ice-200">No trades recorded for this season.</p>
      ) : (
        <div className="space-y-3">
          {completedTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              seasonTeamNames={seasonTeamNames}
            />
          ))}

          {vetoedTrades.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-ice-100 pt-4">
                Vetoed Trades
              </h2>
              {vetoedTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  seasonTeamNames={seasonTeamNames}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
