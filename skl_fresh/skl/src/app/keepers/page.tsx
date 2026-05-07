export const dynamic = "force-dynamic";
import { getAllSeasonsWithKeepersGrouped } from "@/lib/queries/keepers";
import { AccordionRow } from "@/components/AccordionRow";
import Link from "next/link";

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
    case "F": return "text-ice-100";
    case "D": return "text-ice-200";
    case "G": return "text-gold-400";
    default:  return "text-ice-200";
  }
}

function pillStyle(position: string | null) {
  switch (position) {
    case "F": return "bg-rink-700 text-ice-50";
    case "D": return "bg-rink-700 text-ice-200 ring-1 ring-rink-600";
    case "G": return "bg-rink-700 text-gold-400";
    default:  return "bg-rink-700 text-ice-200";
  }
}

export default async function KeepersPage() {
  const seasons = await getAllSeasonsWithKeepersGrouped();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">Keepers</h1>
        <div className="flex gap-4 mt-2 text-xs text-ice-300">
          <span className="text-ice-100">F Forward</span>
          <span className="text-ice-200">D Defense</span>
          <span className="text-gold-400">G Goalie</span>
        </div>
      </div>

      <div className="card overflow-hidden">
        {seasons.map((s) => {
          const hasKeepers = s.keepers.length > 0;

          // Group by franchise
          const byFranchise: Record<string, { gmName: string; slug: string; keepers: typeof s.keepers }> = {};
          for (const k of s.keepers) {
            if (!byFranchise[k.franchiseId]) {
              byFranchise[k.franchiseId] = { gmName: k.franchise.gmName, slug: k.franchise.slug, keepers: [] };
            }
            byFranchise[k.franchiseId].keepers.push(k);
          }
          const groups = Object.values(byFranchise).sort((a, b) => a.gmName.localeCompare(b.gmName));

          return (
            <AccordionRow
              key={s.id}
              header={
                <div className="flex items-center gap-4">
                  <span className="text-ice-50 font-semibold w-20">{s.yearLabel}</span>
                  <span className="text-xs text-ice-300 uppercase tracking-wider">{s.platform}</span>
                  {hasKeepers ? (
                    <span className="text-xs text-ice-400">{s.keepers.length} keepers</span>
                  ) : (
                    <span className="text-xs text-ice-400 italic">no data</span>
                  )}
                </div>
              }
            >
              {!hasKeepers ? (
                <p className="text-ice-300 text-sm italic">Keeper data not available for this season.</p>
              ) : (
                <div className="space-y-4">
                  {groups.map((g) => (
                    <div key={g.slug}>
                      <Link
                        href={`/owners/${g.slug}`}
                        className="text-xs font-semibold text-ice-300 uppercase tracking-wider hover:text-gold-400 transition-colors"
                      >
                        {g.gmName}
                      </Link>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {sortKeepers(g.keepers).map((k) => (
                          <span key={k.id} className={`px-2 py-0.5 rounded text-xs ${pillStyle(k.position)}`}>
                            {k.playerName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionRow>
          );
        })}
      </div>
    </div>
  );
}
