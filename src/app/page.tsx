import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gold-400 mb-3">Shep's Keeper League</h1>
        <p className="text-ice-200 text-lg">Fantasy Hockey · Est. 2008 · 15 Teams</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { href: "/seasons",    label: "Seasons",    desc: "Year-by-year standings" },
          { href: "/champions",  label: "Champions",  desc: "League winners" },
          { href: "/keepers",    label: "Keepers",    desc: "Who kept who" },
          { href: "/owners",     label: "Managers",   desc: "GM pages" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 hover:border-rink-600 hover:bg-rink-700 transition-colors group"
          >
            <div className="font-semibold text-ice-50 group-hover:text-gold-400 transition-colors">
              {label}
            </div>
            <div className="text-sm text-ice-200 mt-1">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
