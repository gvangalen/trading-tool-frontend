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
        fixed top-0 left-64 z-40
        h-16 w-[calc(100%-16rem)]
        bg-[var(--topbar-bg)]
        border-b border-[var(--topbar-border)]
        shadow-[var(--topbar-shadow)]
        flex items-center justify-between px-8
      "
    >
      <h1 className="text-lg font-semibold tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        <div
          className="
            hidden md:flex items-center px-4 py-2 rounded-xl
            bg-[var(--sidebar-hover)]
            border border-[var(--sidebar-border)]
            text-[var(--sidebar-text)]
          "
        >
          <Search className="w-5 h-5 text-[var(--sidebar-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoeken…"
            className="bg-transparent outline-none w-48 text-sm"
          />
        </div>

        <AvatarMenu />
      </div>
    </header>
  );
}
