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

        /* ✨ Glass effect */
        bg-[var(--bg)]/70
        backdrop-blur-xl

        /* Border + soft shadow */
        border-b border-[var(--border)]
        shadow-[0_2px_6px_rgba(0,0,0,0.05)]

        /* Match sidebar curve */
        rounded-bl-3xl
      "
    >
      {/* Titel */}
      <h1 className="text-[1.35rem] font-semibold text-[var(--text-dark)] tracking-tight">
        {title}
      </h1>

      {/* Rechtersectie */}
      <div className="flex items-center gap-6">

        {/* Searchbar */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2
            rounded-xl
            border border-[var(--border)]

            bg-[var(--bg-soft)]
            transition-all duration-200 ease-out

            hover:bg-white
            hover:shadow-sm
            focus-within:ring-2 focus-within:ring-[var(--primary)]
          "
        >
          <Search className="w-5 h-5 text-[var(--text-light)]" />

          <input
            type="text"
            placeholder="Zoeken…"
            className="
              bg-transparent outline-none w-48
              text-[var(--text-dark)]
              placeholder-[var(--text-light)]
            "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Avatar Dropdown */}
        <AvatarMenu />
      </div>
    </header>
  );
}
