"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AvatarMenu from "@/components/ui/AvatarMenu";
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
        h-16 z-40 flex items-center justify-between
        px-8
        w-[calc(100%-16rem)] ml-64

        /* THEME COLORS — MATCH NAVBAR */
        bg-[var(--sidebar-bg)]
        text-[var(--sidebar-text)]
        border-b border-[var(--sidebar-border)]

        /* DEPTH + GLOW */
        shadow-[var(--surface-shadow)]
        before:absolute before:inset-0 before:bg-[var(--surface-glow)]
        before:pointer-events-none

        /* Modern effect */
        backdrop-blur-md
      "
    >
      {/* Titel */}
      <h1 className="relative z-10 text-[1.35rem] font-semibold tracking-tight">
        {title}
      </h1>

      {/* Right side */}
      <div className="relative z-10 flex items-center gap-6">

        {/* Searchbar */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2 rounded-xl
            bg-[var(--sidebar-hover)]
            border border-[var(--sidebar-border)]
            text-[var(--sidebar-text)]
            transition-all duration-200

            hover:bg-[var(--sidebar-active)]
            focus-within:ring-2 focus-within:ring-[var(--primary)]
            shadow-[inset_0_0_6px_rgba(255,255,255,0.04)]
          "
        >
          <Search className="w-5 h-5 text-[var(--sidebar-text-muted)]" />

          <input
            type="text"
            placeholder="Zoeken…"
            className="
              bg-transparent outline-none w-48
              text-[var(--sidebar-text)]
              placeholder-[var(--sidebar-text-muted)]
            "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Avatar Menu */}
        <AvatarMenu />
      </div>
    </header>
  );
}
