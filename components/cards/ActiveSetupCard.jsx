'use client';

import { useEffect, useState } from "react";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { fetchLastSetup } from "@/lib/api/setups";
import CardWrapper from "@/components/ui/CardWrapper";

export default function ActiveSetupCard() {
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

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
    <CardWrapper>
      <div
        className="
          h-[260px]
          p-5 rounded-xl
          border border-[var(--card-border)]
          bg-[var(--card-bg)]
          shadow-sm
          flex flex-col justify-between
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg shadow-sm ${boxClass}`}>
            <TrendingUp className="w-5 h-5 text-[var(--text-dark)] dark:text-[var(--text-light)]" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
            Actieve Setup
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-sm text-[var(--text-light)] italic py-3 flex-1">
            ⏳ Laden…
          </p>
        )}

        {/* EMPTY */}
        {!loading && !setup && (
          <p className="text-sm italic text-[var(--text-light)] py-3 flex-1">
            Geen actieve setup gevonden.
          </p>
        )}

        {/* DATA */}
        {!loading && setup && (
          <div className="flex flex-col justify-between flex-1">
            <div className="space-y-[2px] text-sm text-[var(--text-dark)]">
              <p>
                <strong>Naam:</strong> {setup.name || "–"}
              </p>
              <p>
                <strong>Trend:</strong> {setup.trend || "–"}
              </p>
              <p>
                <strong>Timeframe:</strong> {setup.timeframe || "–"}
              </p>
              <p>
                <strong>Type:</strong> {setup.strategy_type || "–"}
              </p>
              <p>
                <strong>Asset:</strong> {setup.symbol || "–"}
              </p>
            </div>

            {/* COLLAPSIBLE EXTRA INFO */}
            <div className="mt-3">
              <div
                className={`
                  text-xs italic p-2 rounded-lg
                  bg-gray-100 dark:bg-gray-900/40
                  text-[var(--text-light)]
                  border border-gray-200 dark:border-gray-800
                  transition-all duration-300
                  ${expanded ? "h-auto" : "line-clamp-2"}
                `}
              >
                Klik voor details op de setups-pagina.
              </div>

              <button
                className="
                  mt-1 text-[var(--primary-dark)] text-xs
                  hover:underline flex items-center gap-1
                "
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    Toon minder <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Toon meer <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
