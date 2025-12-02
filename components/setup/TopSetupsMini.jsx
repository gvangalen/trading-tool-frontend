"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

// Lucide Icons
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Brain,
  Filter,
} from "lucide-react";

export default function TopSetupsMini() {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendFilter, setTrendFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);

  /* -------------------------------------------------------------
     🔄 Data ophalen
  ------------------------------------------------------------- */
  useEffect(() => {
    loadTopSetups();
    const interval = setInterval(() => loadTopSetups(), 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadTopSetups() {
    try {
      setLoading(true);

      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/setups/top?limit=10`);
        if (!res.ok) throw new Error("Top endpoint faalt");
      } catch {
        res = await fetch(`${API_BASE_URL}/api/setups`);
        if (!res.ok) throw new Error("Fallback faalt");
      }

      const data = await res.json();

      const setups = Array.isArray(data)
        ? data
        : Array.isArray(data.setups)
        ? data.setups
        : [];

      const sorted = setups
        .filter((s) => typeof s.score === "number")
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setTopSetups(sorted);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Fout bij laden setups:", error);
      setTopSetups([]);
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------------------------------------
     🎚 Filter
  ------------------------------------------------------------- */
  const filteredSetups = topSetups
    .filter((s) => trendFilter === "all" || s.trend === trendFilter)
    .slice(0, 3);

  /* -------------------------------------------------------------
     📡 Loading / Empty states
  ------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="text-[var(--text-light)] text-sm text-center py-4">
        📡 Setups laden...
      </div>
    );
  }

  if (topSetups.length === 0) {
    return (
      <div className="text-[var(--text-light)] text-sm text-center py-4">
        ⚠️ Geen actieve setups gevonden.
      </div>
    );
  }

  /* -------------------------------------------------------------
     📊 Trend icon helper
  ------------------------------------------------------------- */
  const trendIcon = (trend) => {
    switch (trend) {
      case "bullish":
        return <TrendingUp size={14} className="text-green-600" />;
      case "bearish":
        return <TrendingDown size={14} className="text-red-600" />;
      default:
        return <Scale size={14} className="text-yellow-600" />;
    }
  };

  /* -------------------------------------------------------------
     🧠 Component
  ------------------------------------------------------------- */
  return (
    <div className="space-y-4 text-sm">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[var(--text-dark)] flex items-center gap-2">
          <Brain size={16} className="text-[var(--primary-dark)]" />
          Top Setups
        </h4>

        {lastUpdated && (
          <span className="text-xs text-[var(--text-light)] italic">
            {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Filter dropdown */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-[var(--text-light)]" />
        <select
          value={trendFilter}
          onChange={(e) => setTrendFilter(e.target.value)}
          className="
            text-xs px-2 py-1 rounded-lg border border-[var(--border)]
            bg-[var(--bg-soft)]
            text-[var(--text-dark)]
            focus:ring-1 focus:ring-[var(--primary)]
            cursor-pointer
          "
        >
          <option value="all">Alle trends</option>
          <option value="bullish">Bullish</option>
          <option value="bearish">Bearish</option>
          <option value="neutral">Neutraal</option>
        </select>
      </div>

      {/* Setup lijst */}
      <ul className="space-y-2">
        {filteredSetups.length === 0 ? (
          <p className="text-[var(--text-light)] text-sm italic">
            Geen setups voor deze trend.
          </p>
        ) : (
          filteredSetups.map((setup) => (
            <li
              key={setup.id}
              className="
                bg-[var(--bg-soft)] hover:bg-white 
                border border-[var(--border)]
                rounded-xl px-3 py-2 flex items-center justify-between
                transition-all shadow-sm
              "
            >
              <div className="flex items-center gap-2">
                {trendIcon(setup.trend)}

                <div>
                  <span className="font-semibold text-[var(--text-dark)]">
                    {setup.name}
                  </span>
                  <span className="ml-2 text-xs text-[var(--text-light)]">
                    {setup.indicators?.split(',')[0] || '–'}
                  </span>
                </div>
              </div>

              <span className="font-semibold text-[var(--text-dark)]">
                {setup.score?.toFixed(1) ?? "-"}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
