'use client';

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

  // 🎨 Trendkleur
  const trend = setup?.trend?.toLowerCase() || "neutral";

  const trendClasses = {
    bullish:
      "bg-green-100/60 dark:bg-green-900/40 border-green-300/60 dark:border-green-800",
    bearish:
      "bg-red-100/60 dark:bg-red-900/40 border-red-300/60 dark:border-red-800",
    neutral:
      "bg-gray-100/60 dark:bg-gray-900/40 border-gray-300/60 dark:border-gray-800",
  };

  const boxClass = trendClasses[trend] || trendClasses.neutral;

  return (
    <CardWrapper
      title="Actieve Setup"
      icon={<TrendingUp className="w-4 h-4 text-[var(--text-dark)]" />}
    >
      <div className="flex flex-col gap-4 text-sm text-[var(--text-dark)]">

        {/* LOADING */}
        {loading && (
          <p className="text-[var(--text-light)] italic py-2">
            ⏳ Laden…
          </p>
        )}

        {/* EMPTY */}
        {!loading && !setup && (
          <p className="italic text-[var(--text-light)] py-2">
            Geen actieve setup gevonden.
          </p>
        )}

        {/* DATA */}
        {!loading && setup && (
          <>
            <div className="space-y-[3px]">
              <p><strong>Naam:</strong> {setup.name || "–"}</p>
              <p><strong>Trend:</strong> {setup.trend || "–"}</p>
              <p><strong>Timeframe:</strong> {setup.timeframe || "–"}</p>
              <p><strong>Type:</strong> {setup.strategy_type || "–"}</p>
              <p><strong>Asset:</strong> {setup.symbol || "–"}</p>
            </div>

            <div
              className={`
                mt-2 text-xs italic p-2 rounded-lg 
                border ${boxClass}
                text-[var(--text-light)]
              `}
            >
              Bekijk details op de setups-pagina.
            </div>
          </>
        )}
      </div>
    </CardWrapper>
  );
}
