export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getFranchiseBySlug } from "@/lib/queries/franchises";
import Link from "next/link";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const posOrder = { F: 0, D: 1, G: 2 } as const;

function sortKeepers<T extends { position: string | null; playerName: string }>(keepers: T[]): T[] {
  return [...keepers].sort((a, b) => {
    const pa = posOrder[a.position as keyof typeof posOrder] ?? 9;
    const pb = posOrder[b.position as keyof typeof posOrder] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.playerName.localeCompare(b.playerName);
  });
}

function positionStyle(position: string | null) {
  switch (position) {
    case "F": return "bg-rink-700 text-ice-100";
    case "D": return "bg-blue-900 text-blue-300";
    case "G": return "bg-yellow-900 text-gold-400";
    default:  return "bg-rink-700 text-ice-200";
  }
}

export default async function FranchisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const franchise = await getFranchiseBySlug(slug);
  if (!franchise) notFound();

  // Group keepers by season
  const keepersBySeason: Record<string, typeof franchise.keepers> = {};
  for (const k of franchise.keepers) {
    const y = k.season.yearLabel;
    if (!keepersBySeason[y]) keepersBySeason[y] = [];
    keepersBySeason[y].push(k);
  }

  // Group teamSeasons by year
  const teamSeasonByYear: Record<string, typeof franchise.teamSeasons[0]> = {};
  for (const ts of franchise.teamSeasons) {
    teamSeasonByYear[ts.season.yearLabel] = ts;
  }

  // Deduplicate trades, group by season
  const tradeMap = new Map<string, (typeof franchise.tradeSides)[0]["trade"]>();
  for (const side of franchise.tradeSides) {
    if (!tradeMap.has(side.trade.id)) tradeMap.set(side.trade.id, side.trade);
  }
  const tradesBySeason: Record<string, Array<(typeof franchise.tradeSides)[0]["trade"]>> = {};
  for (const trade of tradeMap.values()) {
    const y = trade.season.yearLabel;
    if (!tradesBySeason[y]) tradesBySeason[y] = [];
    tradesBySeason[y].push(trade);
  }

  // Build team name lookup per season for trade cards
  const teamNamesBySeasonAndFranchise: Record<string, Record<string, string>> = {};
  for (const trade of tradeMap.values()) {
    const y = trade.season.yearLabel;
    if (!teamNamesBySeasonAndFranchise[y]) teamNamesBySeasonAndFranchise[y] = {};
    for (const side of trade.sides) {
      // We don't have season teamNames here, use empty for now
      teamNamesBySeasonAndFranchise[y][side.franchiseId] = "";
    }
  }
  // Fill in this franchise's own team names
  for (const ts of franchise.teamSeasons) {
    const y = ts.season.yearLabel;
    if (!teamNamesBySeasonAndFranchise[y]) teamNamesBySeasonAndFranchise[y] = {};
    teamNamesBySeasonAndFranchise[y][franchise.id] = ts.teamName;
  }

  // All unique season years, descending
  const allYears = [...new Set([
    ...franchise.teamSeasons.map(ts => ts.season.yearLabel),
    ...Object.keys(keepersBySeason),
    ...Object.keys(tradesBySeason),
  ])].sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-ice-50">{franchise.gmName}</h1>

      {allYears.map((year) => {
        const ts = teamSeasonByYear[year];
        const keepers = keepersBySeason[year] ?? [];
        const trades = (tradesBySeason[year] ?? []).sort((a, b) =>
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        const teamNames = teamNamesBySeasonAndFranchise[year] ?? {};

        return (
          <div key={year} className="space-y-0">
            {/* Season label */}
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/seasons/${year}`} className="text-gold-400 font-bold text-lg hover:underline">
                {year}
              </Link>
              {ts?.isChampion && (
                <span className="text-gold-400 text-xs font-bold uppercase tracking-wide">Champion</span>
              )}
              {ts?.isInTheMoney && !ts?.isChampion && (
                <span className="text-green-400 text-xs font-medium uppercase tracking-wide">ITM</span>
              )}
            </div>

            <div className="card divide-y divide-rink-700">
              {/* Season result */}
              {ts && (
                <div className="px-5 py-3 flex items-center gap-6 text-sm">
                  <span className="text-ice-100 font-medium">{ts.rank ? ordinal(ts.rank) : "—"}</span>
                  {ts.points && <span className="text-ice-200">{ts.points} pts</span>}
                  <span className="text-ice-300 text-xs">{ts.teamName}</span>
                </div>
              )}

              {/* Keepers */}
              {keepers.length > 0 && (
                <div className="px-5 py-4">
                  <div className="text-xs uppercase tracking-wider text-ice-400 mb-3">
                    <Link href={`/keepers/${year}`} className="hover:text-ice-200 transition-colors">
                      Keepers
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sortKeepers(keepers).map((k) => (
                      <span key={k.id} className={`px-2 py-1 rounded text-sm ${positionStyle(k.position)}`}>
                        {k.playerName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trades */}
              {trades.length > 0 && (
                <div className="px-5 py-4">
                  <div className="text-xs uppercase tracking-wider text-ice-400 mb-3">
                    <Link href={`/trades/${year}`} className="hover:text-ice-200 transition-colors">
                      Trades
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {trades.map((trade) => {
                      // Always put this franchise on the left
                      const mySide = trade.sides.find((s) => s.franchiseId === franchise.id);
                      const otherSide = trade.sides.find((s) => s.franchiseId !== franchise.id);
                      if (!mySide || !otherSide) return null;

                      return (
                        <div
                          key={trade.id}
                          className={`rounded-lg overflow-hidden border border-rink-700 ${trade.isVetoed ? "opacity-60" : ""}`}
                        >
                          {trade.isVetoed && (
                            <div className="px-3 pt-2 pb-0">
                              <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Vetoed</span>
                            </div>
                          )}
                          <div className="grid grid-cols-2 divide-x divide-rink-700">
                            <div className="p-3">
                              <div className="text-xs font-bold text-ice-50 uppercase tracking-wide">
                                {franchise.gmName}
                              </div>
                              {teamNames[franchise.id] && (
                                <div className="text-xs text-ice-300 mt-0.5">{teamNames[franchise.id]}</div>
                              )}
                              <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                              <div className="space-y-0.5">
                                {otherSide.players.map((p) => (
                                  <div key={p} className="text-sm text-ice-100">{p}</div>
                                ))}
                              </div>
                            </div>
                            <div className="p-3">
                              <Link
                                href={`/owners/${otherSide.franchise.slug}`}
                                className="text-xs font-bold text-ice-50 uppercase tracking-wide hover:text-gold-400 transition-colors"
                              >
                                {otherSide.franchise.gmName}
                              </Link>
                              <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                              <div className="space-y-0.5">
                                {mySide.players.map((p) => (
                                  <div key={p} className="text-sm text-ice-100">{p}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
