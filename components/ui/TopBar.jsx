"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AvatarMenu from "@/components/ui/AvatarMenu";
import { Search } from "lucide-react";

export default function TopBar() {
  const pathname = usePathname();

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
        topbar-surface   /* <-- BELANGRIJK */
        fixed top-0 left-64
        h-16 w-[calc(100%-16rem)]
        z-40
        flex items-center justify-between
        px-8
      "
    >
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--sidebar-hover)] border border-[var(--sidebar-border)]">
          <Search className="w-5 h-5 text-[var(--sidebar-text-muted)]" />
          <input
            placeholder="Zoeken…"
            className="bg-transparent outline-none w-48 text-[var(--sidebar-text)]"
          />
        </div>

        <AvatarMenu />
      </div>
    </header>
  );
}
