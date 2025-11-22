"use client";

import { usePathname } from "next/navigation";
import AvatarMenu from "./AvatarMenu";
import { useState } from "react";
import { Search } from "lucide-react";

export default function TopBar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const pageTitles = {
    "/": "Dashboard — Scores",
    "/market": "Market Data",
    "/macro": "Macro Analyse",
    "/technical": "Technische Indicatoren",
    "/setup": "Setups",
    "/strategy": "Strategieën",
    "/report": "Rapporten",
    "/profile": "Profiel",
  };

  const title = pageTitles[pathname] || "TradeLayer";

  return (
    <header
      className="
        fixed top-0 right-0
        h-16 w-[calc(100%-16rem)]
        ml-64
        bg-[var(--bg-main)]/95 backdrop-blur-xl
        border-b border-[var(--border)]
        flex items-center justify-between
        px-6
        shadow-sm
        z-40
      "
    >
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-[var(--text-dark)]">
        {title}
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-6">

        {/* Search bar */}
        <div
          className="
            hidden md:flex items-center gap-2
            bg-[var(--bg-soft)]
            border border-[var(--border)]
            rounded-xl px-3 py-2
            transition
            hover:bg-[var(--bg-hover)]
            focus-within:ring-1 focus-within:ring-[var(--primary)]
          "
        >
          <Search className="w-5 h-5 text-[var(--text-muted)]" />

          <input
            type="text"
            placeholder="Zoeken…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              bg-transparent outline-none
              text-[var(--text-dark)]
              placeholder-[var(--text-muted)]
              w-48
            "
          />
        </div>

        {/* Avatar dropdown */}
        <AvatarMenu />
      </div>
    </header>
  );
}
