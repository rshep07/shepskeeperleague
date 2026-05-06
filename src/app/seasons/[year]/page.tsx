import { notFound } from "next/navigation";
import { getSeasonByYear } from "@/lib/queries/seasons";

export default async function SeasonPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const season = await getSeasonByYear(year);
  if (!season) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">{season.yearLabel} Season</h1>
        <p className="text-ice-200 text-sm mt-1">
          {season.platform} · {season.teamCount} teams · Top {season.payoutCount} paid · {season.keeperLimit} keepers
        </p>
      </div>

      {season.teamSeasons.length === 0 ? (
        <p className="text-ice-200">Standings not yet imported for this season.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rink-700 text-ice-200 text-left">
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rink-700">
              {season.teamSeasons.map((ts) => (
                <tr key={ts.id} className="hover:bg-rink-700 transition-colors">
                  <td className="px-4 py-3 text-ice-200 font-mono">
                    {ts.rank ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ice-50">{ts.teamName}</div>
                    <div className="text-xs text-ice-200">{ts.franchise.gmName}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-ice-50 font-mono">
                    {ts.points ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ts.isChampion && (
                      <span className="text-gold-400 text-xs font-bold">CHAMPION</span>
                    )}
                    {ts.isInTheMoney && !ts.isChampion && (
                      <span className="text-green-400 text-xs font-medium">ITM</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
