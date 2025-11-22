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
    <header className="
      sticky top-0 right-0
      bg-white/90 backdrop-blur-md 
      border-b border-gray-200
      h-16 w-full
      flex items-center justify-between
      px-6
      shadow-sm
      z-40
    ">
      
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">
        {title}
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="
          hidden md:flex
          items-center gap-2 
          bg-gray-100 border border-gray-300 
          px-3 py-2 rounded-lg
          focus-within:border-blue-500
          transition
        ">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Zoeken…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-48"
          />
        </div>

        {/* Avatar dropdown */}
        <AvatarMenu />
      </div>
    </header>
  );
}
