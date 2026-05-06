import Link from "next/link";
import { getAllSeasons } from "@/lib/queries/seasons";

export default async function SeasonsPage() {
  const seasons = await getAllSeasons();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Seasons</h1>
      {seasons.length === 0 && (
        <p className="text-ice-200">No seasons yet. Run the seed script to load 2024-25.</p>
      )}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {seasons.map((s) => (
          <Link
            key={s.id}
            href={`/seasons/${s.yearLabel}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
          >
            <span className="font-semibold text-ice-50">{s.yearLabel}</span>
            <div className="flex items-center gap-3 text-sm text-ice-200">
              <span>{s.platform}</span>
              <span>{s.teamCount} teams</span>
              {s.isFinalized && (
                <span className="text-gold-400 font-medium">Finalized</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
