import { notFound } from "next/navigation";
import { getKeepersBySeason } from "@/lib/queries/keepers";
import { db } from "@/lib/db";

export default async function KeepersByYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  const season = await db.season.findUnique({ where: { yearLabel: year } });
  if (!season) notFound();

  const keepers = await getKeepersBySeason(year);

  // Group by franchise
  const byFranchise = keepers.reduce<Record<string, typeof keepers>>((acc, k) => {
    const key = k.franchiseId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(k);
    return acc;
  }, {});

  const groups = Object.values(byFranchise);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">{year} Keepers</h1>
        <p className="text-ice-200 text-sm mt-1">
          {season.keeperLimit} keepers per team · {groups.length} teams
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => {
          const franchise = group[0].franchise;
          return (
            <div key={franchise.id} className="card p-5 space-y-3">
              <div>
                <div className="font-bold text-ice-50">{group[0].season.yearLabel === year
                  ? franchise.currentName
                  : franchise.currentName}</div>
                <div className="text-xs text-ice-200">{franchise.gmName}</div>
              </div>
              <ul className="space-y-1">
                {group.map((k) => (
                  <li key={k.id} className="flex items-center justify-between text-sm">
                    <span className="text-ice-100">{k.playerName}</span>
                    <span className="text-ice-200 text-xs">{k.position ?? ""}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-rink-600 font-mono">{group.length} / {season.keeperLimit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
