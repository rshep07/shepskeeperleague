export const dynamic = "force-dynamic";
import Link from "next/link";
import { getAllFranchises } from "@/lib/queries/franchises";

const INACTIVE_SLUGS = new Set(["senkiw", "longman", "shockey", "fudge"]);

export default async function FranchisesPage() {
  const franchises = await getAllFranchises();

  const active   = franchises.filter((f) => !INACTIVE_SLUGS.has(f.slug)).sort((a, b) => a.gmName.localeCompare(b.gmName));
  const inactive = franchises.filter((f) =>  INACTIVE_SLUGS.has(f.slug)).sort((a, b) => a.gmName.localeCompare(b.gmName));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-ice-50">Franchises</h1>

      {/* Active GMs */}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {active.map((f) => (
          <Link
            key={f.id}
            href={`/franchises/${f.slug}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
          >
            <span className="font-semibold text-ice-50">{f.gmName}</span>
            <span className="text-ice-200 text-sm">→</span>
          </Link>
        ))}
      </div>

      {/* Inactive GMs */}
      {inactive.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Former GMs</h2>
          <div className="divide-y divide-red-950 card border-red-900 overflow-hidden">
            {inactive.map((f) => (
              <Link
                key={f.id}
                href={`/franchises/${f.slug}`}
                className="flex items-center justify-between px-5 py-4 bg-red-950 hover:bg-red-900 transition-colors"
              >
                <span className="font-semibold text-red-400">{f.gmName}</span>
                <span className="text-red-700 text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
