"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AvatarMenu from "@/components/ui/AvatarMenu";
import { Search } from "lucide-react";

export default function TopBar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const titles = {
    "/": "Dashboard — Scores",
    "/market": "Market Data",
    "/macro": "Macro Analyse",
    "/technical": "Technische Indicatoren",
    "/setup": "Setups",
    "/strategy": "Strategieën",
    "/report": "Rapporten",
  };

  const title = titles[pathname] || "TradeLayer";

  return (
    <header
      className="
        h-full w-full
        flex items-center justify-between
        px-4 md:px-8
        relative z-50
      "
    >
      {/* ============= LEFT SIDE ============= */}
      <div className="flex items-center gap-4">

        {/* MOBIEL: MENU BUTTON */}
        <button
          data-mobile-menu
          className="
            md:hidden
            p-2 rounded-lg
            hover:bg-black/5
            transition
          "
        >
          <svg
            width="24"
            height="24"
            stroke="currentColor"
            className="text-[var(--topbar-text)]"
          >
            <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" />
          </svg>
        </button>

        {/* PAGINA TITEL */}
        <h1 className="text-xl md:text-[1.35rem] font-semibold tracking-tight text-[var(--topbar-text)]">
          {title}
        </h1>
      </div>

      {/* ============= RIGHT SIDE ============= */}
      <div className="flex items-center gap-6">

        {/* SEARCH BAR (desktop only) */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2 rounded-xl
            bg-[var(--sidebar-hover)]
            border border-[var(--sidebar-border)]
            text-[var(--sidebar-text)]
            hover:bg-[var(--sidebar-active)]
            transition-all
            shadow-sm
          "
        >
          <Search className="w-5 h-5 text-[var(--sidebar-text-muted)]" />
          <input
            className="
              bg-transparent outline-none
              w-48
              text-[var(--sidebar-text)]
              placeholder-[var(--sidebar-text-muted)]
            "
            placeholder="Zoeken…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* AVATAR */}
        <AvatarMenu />
      </div>
    </header>
  );
}
