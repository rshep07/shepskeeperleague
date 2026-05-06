export const dynamic = "force-dynamic";
import Link from "next/link";
import { getSeasonsWithTrades } from "@/lib/queries/trades";

export default async function TradesPage() {
  const seasons = await getSeasonsWithTrades();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ice-50">Trade History</h1>
        <p className="text-ice-200 text-sm mt-1">
          Yahoo seasons only (2008–2019). Fantrax trade history is not available.
        </p>
      </div>

      {seasons.length === 0 ? (
        <p className="text-ice-200">No trade data loaded yet.</p>
      ) : (
        <div className="divide-y divide-rink-700 card overflow-hidden">
          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/trades/${s.yearLabel}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
            >
              <span className="font-semibold text-ice-50">{s.yearLabel}</span>
              <div className="flex items-center gap-3 text-sm text-ice-200">
                <span>{s.platform}</span>
                <span>{s._count.trades} trades</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
