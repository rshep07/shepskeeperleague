export const dynamic = "force-dynamic";
import { getAllSeasonsWithTradeDetails } from "@/lib/queries/trades";
import { AccordionRow } from "@/components/AccordionRow";
import Link from "next/link";

export default async function TradesPage() {
  const seasons = await getAllSeasonsWithTradeDetails();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">Trade History</h1>
        <p className="text-ice-300 text-sm mt-1">Yahoo seasons only (2008–2019). Fantrax trade history unavailable.</p>
      </div>

      <div className="card overflow-hidden">
        {seasons.map((s) => {
          const completed = s.trades.filter(t => !t.isVetoed);
          const vetoed = s.trades.filter(t => t.isVetoed);
          const isYahoo = s.platform === "YAHOO";

          const teamNames: Record<string, string> = {};
          for (const ts of s.teamSeasons) teamNames[ts.franchiseId] = ts.teamName;

          return (
            <AccordionRow
              key={s.id}
              header={
                <div className="flex items-center gap-4">
                  <span className="text-ice-50 font-semibold w-20">{s.yearLabel}</span>
                  <span className="text-xs text-ice-300 uppercase tracking-wider">{s.platform}</span>
                  <span className="text-xs text-ice-400">{completed.length} trades</span>
                  {vetoed.length > 0 && (
                    <span className="text-xs text-ice-400">{vetoed.length} vetoed</span>
                  )}
                </div>
              }
            >
              <div className="space-y-3">
                {isYahoo && (
                  <div className="rounded-lg border border-gold-400/20 bg-gold-400/5 px-4 py-2.5 text-xs text-gold-300">
                    Draft picks were tradeable on Yahoo and may not be reflected here. Some trades may appear more one-sided than they were.
                  </div>
                )}

                {completed.map((trade) => {
                  const [a, b] = trade.sides;
                  if (!a || !b) return null;
                  return (
                    <div key={trade.id} className="rounded-lg overflow-hidden border border-rink-700">
                      <div className="grid grid-cols-2 divide-x divide-rink-700">
                        <div className="p-3 bg-rink-900/40">
                          <Link href={`/owners/${a.franchise.slug}`} className="text-xs font-bold text-ice-50 uppercase tracking-wide hover:text-gold-400 transition-colors">
                            {a.franchise.gmName}
                          </Link>
                          {teamNames[a.franchiseId] && (
                            <div className="text-xs text-ice-300 italic mt-0.5">{teamNames[a.franchiseId]}</div>
                          )}
                          <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                          <div className="space-y-0.5">
                            {b.players.map(p => <div key={p} className="text-sm text-ice-100">{p}</div>)}
                          </div>
                        </div>
                        <div className="p-3 bg-rink-900/40">
                          <Link href={`/owners/${b.franchise.slug}`} className="text-xs font-bold text-ice-50 uppercase tracking-wide hover:text-gold-400 transition-colors">
                            {b.franchise.gmName}
                          </Link>
                          {teamNames[b.franchiseId] && (
                            <div className="text-xs text-ice-300 italic mt-0.5">{teamNames[b.franchiseId]}</div>
                          )}
                          <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                          <div className="space-y-0.5">
                            {a.players.map(p => <div key={p} className="text-sm text-ice-100">{p}</div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {vetoed.length > 0 && (
                  <>
                    <div className="text-xs text-ice-400 uppercase tracking-wider pt-2">Vetoed</div>
                    {vetoed.map((trade) => {
                      const [a, b] = trade.sides;
                      if (!a || !b) return null;
                      return (
                        <div key={trade.id} className="rounded-lg overflow-hidden border border-red-900/40 opacity-60">
                          <div className="grid grid-cols-2 divide-x divide-rink-700">
                            <div className="p-3 bg-rink-900/40">
                              <div className="text-xs font-bold text-ice-50 uppercase tracking-wide">{a.franchise.gmName}</div>
                              <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                              <div className="space-y-0.5">{b.players.map(p => <div key={p} className="text-sm text-ice-100">{p}</div>)}</div>
                            </div>
                            <div className="p-3 bg-rink-900/40">
                              <div className="text-xs font-bold text-ice-50 uppercase tracking-wide">{b.franchise.gmName}</div>
                              <div className="text-xs text-ice-400 uppercase tracking-wider mt-2 mb-1">received</div>
                              <div className="space-y-0.5">{a.players.map(p => <div key={p} className="text-sm text-ice-100">{p}</div>)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </AccordionRow>
          );
        })}
      </div>
    </div>
  );
}
