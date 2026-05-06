import Link from "next/link";
import { getAllFranchises } from "@/lib/queries/franchises";

// Phase 1: one GM per franchise. Owner page = franchise page with GM framing.
export default async function OwnersPage() {
  const franchises = await getAllFranchises();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Managers</h1>
      {franchises.length === 0 && (
        <p className="text-ice-200">No managers yet. Run the seed script.</p>
      )}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {franchises.map((f) => (
          <Link
            key={f.id}
            href={`/owners/${f.slug}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
          >
            <div>
              <div className="font-semibold text-ice-50">{f.gmName}</div>
              <div className="text-xs text-ice-200">{f.currentName}</div>
            </div>
            <span className="text-ice-200 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
