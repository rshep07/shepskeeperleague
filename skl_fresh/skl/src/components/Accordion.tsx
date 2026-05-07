"use client";
import { useState } from "react";

export function Accordion({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-3 text-left hover:bg-rink-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-ice-400 font-medium">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-ice-400">({count})</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-ice-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}
