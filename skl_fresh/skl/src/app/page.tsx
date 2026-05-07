import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <div className="text-center pt-16 pb-8">
        <p className="text-ice-300 text-xs tracking-widest uppercase mb-4">Fantasy Hockey · Est. 2008</p>
        <h1 className="text-5xl font-bold text-ice-50 tracking-tight mb-2">
          Shep's Keeper League
        </h1>
        <div className="mt-4 h-px w-16 bg-gold-400 mx-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/seasons",   label: "Seasons",   desc: "Year-by-year standings" },
          { href: "/champions", label: "Champions", desc: "League winners" },
          { href: "/keepers",   label: "Keepers",   desc: "Who kept who" },
          { href: "/owners",    label: "Managers",  desc: "GM pages" },
          { href: "/trades",    label: "Trades",    desc: "Yahoo era deal history" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="card p-6 hover:border-gold-400/40 hover:bg-rink-700 transition-all duration-200 group"
          >
            <div className="text-xs text-gold-400 uppercase tracking-widest font-semibold mb-1 group-hover:text-gold-300 transition-colors">
              {label}
            </div>
            <div className="text-sm text-ice-300">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
