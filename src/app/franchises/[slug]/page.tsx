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

  const keepersBySeason = franchise.keepers.reduce<Record<string, typeof franchise.keepers>>((acc, k) => {
    const label = k.season.yearLabel;
    if (!acc[label]) acc[label] = [];
    acc[label].push(k);
    return acc;
  }, {});

  // Sort seasons descending
  const keeperSeasons = Object.entries(keepersBySeason).sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">{franchise.gmName}</h1>
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
                  {ts.rank ? ordinal(ts.rank) : "—"}
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
        {keeperSeasons.length === 0 ? (
          <p className="text-ice-200 text-sm">No keeper data yet.</p>
        ) : (
          <div className="space-y-4">
            {keeperSeasons.map(([year, keepers]) => (
              <div key={year} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/keepers/${year}`} className="text-gold-400 font-semibold hover:underline">
                    {year}
                  </Link>
                  <span className="text-ice-200 text-xs">{keepers.length} keepers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortKeepers(keepers).map((k) => (
                    <span key={k.id} className={`px-2 py-1 rounded text-sm ${positionStyle(k.position)}`}>
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
