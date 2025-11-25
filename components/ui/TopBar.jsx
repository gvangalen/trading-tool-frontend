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
        px-8
      "
    >
      {/* LEFT SIDE: PAGINA TITEL */}
      <h1 className="text-[1.35rem] font-semibold tracking-tight">
        {title}
      </h1>

      {/* RIGHT SIDE: SEARCH + AVATAR */}
      <div className="flex items-center gap-6">

        {/* SEARCH BAR */}
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
