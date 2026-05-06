export const dynamic = "force-dynamic";
import { getAllChampions } from "@/lib/queries/champions";
import { AccordionRow } from "@/components/AccordionRow";
import Link from "next/link";

export default async function ChampionsPage() {
  const champions = await getAllChampions();

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
                <span className="text-gold-400 font-medium">{c.franchise.gmName}</span>
                <span className="text-ice-300 text-sm">{c.teamName}</span>
              </div>
            }
          >
            <div className="rounded-lg border border-rink-700 overflow-hidden">
              <div className="px-4 py-3 bg-rink-900/60 flex items-center gap-6 text-sm">
                <div>
                  <div className="text-xs text-ice-400 uppercase tracking-wider mb-1">GM</div>
                  <Link href={`/owners/${c.franchise.slug}`} className="text-gold-400 hover:text-gold-300 font-medium">
                    {c.franchise.gmName}
                  </Link>
                </div>
                <div>
                  <div className="text-xs text-ice-400 uppercase tracking-wider mb-1">Team</div>
                  <div className="text-ice-100">{c.teamName}</div>
                </div>
                <div>
                  <div className="text-xs text-ice-400 uppercase tracking-wider mb-1">Points</div>
                  <div className="text-ice-100 font-mono">{c.points}</div>
                </div>
                <div>
                  <div className="text-xs text-ice-400 uppercase tracking-wider mb-1">Platform</div>
                  <div className="text-ice-200 text-xs uppercase tracking-wider">{c.season.platform}</div>
                </div>
              </div>
            </div>
          </AccordionRow>
        ))}
      </div>
    </div>
  );
}
