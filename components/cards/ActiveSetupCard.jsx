"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { fetchLastSetup } from "@/lib/api/setups";
import CardWrapper from "@/components/ui/CardWrapper";

export default function ActiveSetupCard() {
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLastSetup();
        setSetup(data || null);
      } catch (err) {
        console.error("❌ ActiveSetupCard error:", err);
        setSetup(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ===========================================================
     🎨 Trend styling
  =========================================================== */

  const trend = setup?.trend?.toLowerCase() || "neutral";

  const TREND_STYLES = {
    bullish: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-800",
    },
    bearish: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-300 dark:border-red-800",
    },
    neutral: {
      bg: "bg-gray-100 dark:bg-gray-800/30",
      text: "text-gray-600 dark:text-gray-300",
      border: "border-gray-300 dark:border-gray-700",
    },
  };

  const trendStyle = TREND_STYLES[trend] ?? TREND_STYLES.neutral;

  return (
    <CardWrapper
      title="Actieve Setup"
      icon={<TrendingUp className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 text-sm text-[var(--text-dark)] min-h-[220px]">

        {/* LOADING */}
        {loading && (
          <p className="text-[var(--text-light)] italic">
            ⏳ Laden…
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && !setup && (
          <p className="italic text-[var(--text-light)]">
            Geen actieve setup gevonden.
          </p>
        )}

        {/* CONTENT */}
        {!loading && setup && (
          <div className="flex flex-col gap-4">

            {/* BASIS INFO */}
            <div className="space-y-[3px]">
              <p><strong>Naam:</strong> {setup.name || "–"}</p>
              <p><strong>Trend:</strong> {setup.trend || "–"}</p>
              <p><strong>Timeframe:</strong> {setup.timeframe || "–"}</p>
              <p><strong>Type:</strong> {setup.strategy_type || "–"}</p>
              <p><strong>Asset:</strong> {setup.symbol || "–"}</p>
            </div>

            {/* TREND BADGE */}
            <div
              className={`
                p-3 rounded-lg border
                text-xs italic
                ${trendStyle.bg}
                ${trendStyle.text}
                ${trendStyle.border}
              `}
            >
              Deze setup is momenteel actief.  
              Bekijk details op de setups-pagina.
            </div>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
