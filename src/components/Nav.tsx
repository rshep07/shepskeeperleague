"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/seasons",    label: "Seasons"    },
  { href: "/champions",  label: "Champions"  },
  { href: "/keepers",    label: "Keepers"    },
  { href: "/owners",     label: "Managers"   },
  { href: "/trades",     label: "Trades"     },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-rink-700 bg-rink-800">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href="/" className="font-bold text-gold-400 tracking-wide text-sm uppercase shrink-0">
          SKL
        </Link>
        <nav className="flex gap-1 overflow-x-auto">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded text-sm transition-colors whitespace-nowrap ${
                path.startsWith(href)
                  ? "bg-rink-700 text-ice-50 font-medium"
                  : "text-ice-200 hover:text-ice-50 hover:bg-rink-700"
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
