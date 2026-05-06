import Link from "next/link";
import { getAllKeeperSeasons } from "@/lib/queries/keepers";

export default async function KeepersPage() {
  const seasons = await getAllKeeperSeasons();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Keeper History</h1>
      <p className="text-ice-200 text-sm">
        Select a season to see which players each team chose to keep.
      </p>
      {seasons.length === 0 && (
        <p className="text-ice-200">No keeper data yet. Run the seed script.</p>
      )}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {seasons.map((s) => (
          <Link
            key={s.id}
            href={`/keepers/${s.yearLabel}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
          >
            <span className="font-semibold text-ice-50">{s.yearLabel}</span>
            <span className="text-ice-200 text-sm">View keepers →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
