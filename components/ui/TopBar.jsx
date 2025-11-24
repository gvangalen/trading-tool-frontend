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
        topbar-surface     /* <<< DE FIX */
        fixed top-0 left-64
        h-16 w-[calc(100%-16rem)]
        z-40 flex items-center justify-between
        px-8 relative
      "
    >
      <div className="absolute inset-0 pointer-events-none [background:var(--surface-glow)]" />

      <h1 className="relative z-10 text-[1.35rem] font-semibold tracking-tight">
        {title}
      </h1>

      <div className="relative z-10 flex items-center gap-6">
        <div className="
          hidden md:flex items-center gap-3
          px-4 py-2 rounded-xl
          bg-[var(--sidebar-hover)]
          border border-[var(--sidebar-border)]
          text-[var(--sidebar-text)]
          hover:bg-[var(--sidebar-active)]
          focus-within:ring-2 focus-within:ring-[var(--primary)]
          shadow-[inset_0_0_6px_rgba(255,255,255,0.04)]
        ">
          <Search className="w-5 h-5 text-[var(--sidebar-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoeken…"
            className="bg-transparent outline-none w-48 text-[var(--sidebar-text)] placeholder-[var(--sidebar-text-muted)]"
          />
        </div>

        <AvatarMenu />
      </div>
    </header>
  );
}
