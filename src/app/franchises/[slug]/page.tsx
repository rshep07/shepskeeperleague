export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getFranchiseBySlug } from "@/lib/queries/franchises";
import Link from "next/link";

export default async function FranchisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const franchise = await getFranchiseBySlug(slug);
  if (!franchise) notFound();

  // Group keepers by season
  const keepersBySeason = franchise.keepers.reduce<Record<string, typeof franchise.keepers>>((acc, k) => {
    const label = k.season.yearLabel;
    if (!acc[label]) acc[label] = [];
    acc[label].push(k);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">{franchise.currentName}</h1>
        <p className="text-ice-200 text-sm">{franchise.gmName}</p>
      </div>

      {/* Season history */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ice-100">Season History</h2>
        {franchise.teamSeasons.length === 0 ? (
          <p className="text-ice-200 text-sm">No season data yet.</p>
        ) : (
          <div className="card overflow-hidden divide-y divide-rink-700">
            {franchise.teamSeasons.map((ts) => (
              <Link
                key={ts.id}
                href={`/seasons/${ts.season.yearLabel}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-rink-700 transition-colors text-sm"
              >
                <span className="text-gold-400 font-medium w-20">{ts.season.yearLabel}</span>
                <span className="text-ice-200 font-mono flex-1">
                  {ts.rank ? `#${ts.rank}` : "—"}
                  {ts.points ? ` · ${ts.points} pts` : ""}
                </span>
                <div className="text-right">
                  {ts.isChampion && <span className="text-gold-400 text-xs font-bold">CHAMPION</span>}
                  {ts.isInTheMoney && !ts.isChampion && <span className="text-green-400 text-xs">ITM</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Keeper history */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ice-100">Keeper History</h2>
        {Object.keys(keepersBySeason).length === 0 ? (
          <p className="text-ice-200 text-sm">No keeper data yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(keepersBySeason).map(([year, keepers]) => (
              <div key={year} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/keepers/${year}`} className="text-gold-400 font-semibold hover:underline">
                    {year}
                  </Link>
                  <span className="text-ice-200 text-xs">{keepers.length} keepers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keepers.map((k) => (
                    <span key={k.id} className="bg-rink-700 px-2 py-1 rounded text-sm text-ice-100">
                      {k.playerName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
