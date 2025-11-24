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

        /* NEW FINTECH DARK TOPBAR */
        bg-[#1A1B1F]/95
        backdrop-blur-md
        border-b border-[#2C2C31]
        shadow-[0_1px_4px_rgba(0,0,0,0.35)]

        rounded-bl-3xl
      "
    >
      {/* Titel */}
      <h1 className="text-[1.35rem] font-semibold text-white tracking-tight">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-6">

        {/* Searchbar */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2
            rounded-xl
            border border-[#3A3A3F]
            bg-[#2A2A2F]
            text-white
            transition-all duration-200

            hover:bg-[#333337]
            focus-within:ring-2 focus-within:ring-[var(--primary)]
          "
        >
          <Search className="w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Zoeken…"
            className="
              bg-transparent outline-none w-48
              text-gray-200
              placeholder-gray-500
            "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <AvatarMenu />
      </div>
    </header>
  );
}
