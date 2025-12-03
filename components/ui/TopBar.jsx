"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AvatarMenu from "@/components/ui/AvatarMenu";
import { Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function TopBar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  /* ======== Dynamische begroeting ======== */
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Goedemorgen"
      : hour < 18
      ? "Goedemiddag"
      : "Goedenavond";

  const firstName = user?.first_name || "";
  const greetingText = firstName ? `${greeting}, ${firstName}` : greeting;

  /* ======== Pagina titel op basis van route ======== */
  const titles = {
    "/": "Trading Dashboard",
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
        text-[var(--topbar-text)]
      "
    >
      {/* LEFT SIDE — Titel */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <h1 className="text-xl md:text-[1.35rem] font-semibold tracking-tight whitespace-nowrap">
          {title}
        </h1>
      </div>

      {/* CENTER — Greeting */}
      <div className="hidden md:flex flex-1 justify-center">
        <p className="text-[var(--text-dark)] text-base font-medium">
          {greetingText}
        </p>
      </div>

      {/* RIGHT — Search + Avatar */}
      <div className="flex items-center gap-6 min-w-[200px] justify-end">
        {/* Desktop Search */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2 rounded-xl
            bg-[var(--bg-soft)]
            border border-[rgba(0,0,0,0.08)]
            hover:border-[rgba(0,0,0,0.15)]
            transition shadow-sm
          "
        >
          <Search className="w-5 h-5 text-[var(--text-light)]" />

          <input
            className="
              bg-transparent outline-none
              w-48
              text-[var(--text-dark)]
              placeholder-[var(--text-light)]
            "
            placeholder="Zoeken…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Avatar */}
        <div
          className="
            rounded-full
            border border-[rgba(0,0,0,0.15)]
            shadow-sm
            p-[2px]
          "
        >
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}
