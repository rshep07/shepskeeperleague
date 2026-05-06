export const dynamic = "force-dynamic";
import Link from "next/link";
import { getAllFranchises } from "@/lib/queries/franchises";

export default async function FranchisesPage() {
  const franchises = await getAllFranchises();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ice-50">Franchises</h1>
      {franchises.length === 0 && (
        <p className="text-ice-200">No franchises yet. Run the seed script.</p>
      )}
      <div className="divide-y divide-rink-700 card overflow-hidden">
        {franchises.map((f) => (
          <Link
            key={f.id}
            href={`/franchises/${f.slug}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-rink-700 transition-colors"
          >
            <div>
              <div className="font-semibold text-ice-50">{f.gmName}</div>

            </div>
            <span className="text-ice-200 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
