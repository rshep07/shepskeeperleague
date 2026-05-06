"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/seasons",   label: "Seasons"   },
  { href: "/champions", label: "Champions" },
  { href: "/keepers",   label: "Keepers"   },
  { href: "/owners",    label: "Managers"  },
  { href: "/trades",    label: "Trades"    },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-rink-700 bg-rink-900 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-gold-400 font-bold tracking-widest text-sm uppercase shrink-0"
        >
          SKL
        </Link>
        <nav className="flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
                path.startsWith(href)
                  ? "text-gold-400"
                  : "text-ice-300 hover:text-ice-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
