"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

import AvatarMenu from "@/components/ui/AvatarMenu";
import { Search } from "lucide-react";

export default function TopBar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  /* -----------------------------
      Dynamische begroeting
  ------------------------------ */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Goedemorgen";
    if (hour < 18) return "Goedemiddag";
    return "Goedenavond";
  };

  const displayName =
    user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : user?.email?.split("@")[0] || "gebruiker";

  /* -----------------------------
      Page titles
  ------------------------------ */
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
        text-[var(--topbar-text)]
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU BUTTON */}
        <button
          data-mobile-menu
          className="
            md:hidden p-2 rounded-lg
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

        <div className="flex flex-col">
          {/* PAGE TITLE */}
          <h1 className="text-xl md:text-[1.35rem] font-semibold tracking-tight">
            {title}
          </h1>

          {/* DYNAMISCHE BEGROETING */}
          {user && (
            <span className="text-sm text-[var(--text-light)] mt-[-2px]">
              {getGreeting()}, <span className="font-medium">{displayName}</span> 👋
            </span>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* DESKTOP SEARCH */}
        <div
          className="
            hidden md:flex items-center gap-3
            px-4 py-2 rounded-xl
            bg-[var(--bg-soft)]
            border border-[rgba(0,0,0,0.08)]
            hover:border-[rgba(0,0,0,0.15)]
            transition
            shadow-sm
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

        {/* AVATAR */}
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
