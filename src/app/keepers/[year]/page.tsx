export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getKeepersBySeason } from "@/lib/queries/keepers";
import { db } from "@/lib/db";

function positionStyle(position: string | null) {
  switch (position) {
    case "F": return "text-ice-100";
    case "D": return "text-blue-400";
    case "G": return "text-gold-400";
    default:  return "text-ice-200";
  }
}

function positionBadge(position: string | null) {
  switch (position) {
    case "F": return "bg-rink-700 text-ice-200";
    case "D": return "bg-blue-900 text-blue-300";
    case "G": return "bg-yellow-900 text-gold-400";
    default:  return "bg-rink-700 text-ice-200";
  }
}

export default async function KeepersByYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  const season = await db.season.findUnique({ where: { yearLabel: year } });
  if (!season) notFound();

  const keepers = await getKeepersBySeason(year);

  const byFranchise = keepers.reduce<Record<string, typeof keepers>>((acc, k) => {
    const key = k.franchiseId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(k);
    return acc;
  }, {});

  const posOrder = { F: 0, D: 1, G: 2 };
  const groups = Object.values(byFranchise).map((group) =>
    [...group].sort((a, b) => {
      const pa = posOrder[a.position as keyof typeof posOrder] ?? 9;
      const pb = posOrder[b.position as keyof typeof posOrder] ?? 9;
      if (pa !== pb) return pa - pb;
      return a.playerName.localeCompare(b.playerName);
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ice-50">{year} Keepers</h1>
          <p className="text-ice-200 text-sm mt-1">
            {season.keeperLimit} keepers per team · {groups.length} teams
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-ice-200">F = Forward</span>
          <span className="text-blue-400">D = Defense</span>
          <span className="text-gold-400">G = Goalie</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => {
          const franchise = group[0].franchise;
          return (
            <div key={franchise.id} className="card p-5 space-y-3">
              <div className="font-bold text-ice-50">{franchise.gmName}</div>
              <ul className="space-y-1">
                {group.map((k) => (
                  <li key={k.id} className="flex items-center justify-between text-sm">
                    <span className={positionStyle(k.position)}>{k.playerName}</span>
                    {k.position && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionBadge(k.position)}`}>
                        {k.position}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
