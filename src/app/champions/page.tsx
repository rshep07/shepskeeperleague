export const dynamic = "force-dynamic";
import { getAllChampionsWithRosters } from "@/lib/queries/champions";
import { AccordionRow } from "@/components/AccordionRow";
import Link from "next/link";

const posOrder = { F: 0, D: 1, G: 2 } as const;

function sortPlayers<T extends { position: string | null; playerName: string }>(
  players: T[]
): T[] {
  return [...players].sort((a, b) => {
    const pa = posOrder[a.position as keyof typeof posOrder] ?? 9;
    const pb = posOrder[b.position as keyof typeof posOrder] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.playerName.localeCompare(b.playerName);
  });
}

function pillStyle(position: string | null) {
  switch (position) {
    case "F": return "bg-rink-700 text-ice-50";
    case "D": return "bg-rink-700 text-ice-200 ring-1 ring-rink-600";
    case "G": return "bg-rink-700 text-gold-400";
    default:  return "bg-rink-700 text-ice-200";
  }
}

export default async function ChampionsPage() {
  const champions = await getAllChampionsWithRosters();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Champions</h1>
      <div className="card overflow-hidden">
        {champions.map((c) => (
          <AccordionRow
            key={c.id}
            header={
              <div className="flex items-center gap-4">
                <span className="text-ice-50 font-semibold w-20">{c.season.yearLabel}</span>
                <Link
                  href={`/owners/${c.franchise.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-gold-400 font-medium hover:text-gold-300 transition-colors"
                >
                  {c.franchise.gmName}
                </Link>
                <span className="text-ice-300 text-sm">{c.teamName}</span>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center gap-6 text-sm text-ice-200">
                <span>{c.points} pts</span>
                <span className="text-ice-300 text-xs uppercase tracking-wider">{c.season.platform}</span>
              </div>
              {c.players.length > 0 ? (
                <div>
                  <div className="text-xs text-ice-400 uppercase tracking-wider mb-2">
                    {c.season.platform === "YAHOO" ? "Winning Roster" : "Keepers Declared"}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sortPlayers(c.players).map((p) => (
                      <span key={p.id} className={`px-2 py-0.5 rounded text-xs ${pillStyle(p.position)}`}>
                        {p.playerName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-ice-400 text-xs italic">Roster data not available for this season.</p>
              )}
            </div>
          </AccordionRow>
        ))}
      </div>
    </div>
  );
}
