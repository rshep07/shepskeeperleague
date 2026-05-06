export const dynamic = "force-dynamic";
import { getAllChampions } from "@/lib/queries/champions";

export default async function ChampionsPage() {
  const champions = await getAllChampions();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Champions</h1>
      {champions.length === 0 && (
        <p className="text-ice-200">No champions recorded yet.</p>
      )}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {champions.map((ts) => (
          <div key={ts.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <span className="text-gold-400 font-bold text-sm mr-3">{ts.season.yearLabel}</span>
              <span className="font-semibold text-ice-50">{ts.franchise.gmName}</span>
            </div>
            {ts.points && (
              <span className="text-ice-200 text-sm font-mono">{ts.points} pts</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
