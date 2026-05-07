export const dynamic = "force-dynamic";
import { getAllSeasonsWithStandings } from "@/lib/queries/seasons";
import { AccordionRow } from "@/components/AccordionRow";
import Link from "next/link";

function ordinal(n: number) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

export default async function SeasonsPage() {
  const seasons = await getAllSeasonsWithStandings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Seasons</h1>
      <div className="card overflow-hidden">
        {seasons.map((s) => (
          <AccordionRow
            key={s.id}
            header={
              <div className="flex items-center gap-4">
                <span className="text-ice-50 font-semibold w-20">{s.yearLabel}</span>
                <span className="text-xs text-ice-300 uppercase tracking-wider">{s.platform}</span>
                <span className="text-xs text-ice-400">{s.teamCount} teams</span>
                {s.isFinalized && (
                  <span className="text-xs text-gold-400 uppercase tracking-wider">Finalized</span>
                )}
              </div>
            }
          >
            <div className="divide-y divide-rink-700 rounded-lg overflow-hidden border border-rink-700">
              {s.teamSeasons.map((ts) => (
                <div key={ts.id} className="flex items-center gap-4 px-4 py-2.5 bg-rink-900/60 text-sm">
                  <span className="text-ice-300 w-8 shrink-0">{ts.rank ? ordinal(ts.rank) : "—"}</span>
                  <Link
                    href={`/owners/${ts.franchise.slug}`}
                    className="flex-1 text-ice-100 hover:text-gold-400 transition-colors"
                  >
                    {ts.teamName}
                  </Link>
                  <span className="text-ice-300 font-mono text-xs">{ts.points} pts</span>
                  {ts.isChampion && (
                    <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">Champion</span>
                  )}
                  {ts.isInTheMoney && !ts.isChampion && (
                    <span className="text-xs text-green-400 uppercase tracking-wide">ITM</span>
                  )}
                </div>
              ))}
            </div>
          </AccordionRow>
        ))}
      </div>
    </div>
  );
}
