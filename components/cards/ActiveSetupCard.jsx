"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { fetchLastSetup } from "@/lib/api/setups";

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
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ===========================================================
     🧠 Trend 1-regel preview
  =========================================================== */
  const TREND_TEXT = {
    bullish: "Setup is bullish en actief.",
    bearish: "Setup is bearish — voorzichtigheid nodig.",
    neutral: "Setup is actief maar trend is neutraal.",
  };

  const trend = setup?.trend?.toLowerCase() || "neutral";
  const trendPreview = TREND_TEXT[trend] ?? TREND_TEXT.neutral;

  return (
    <CardWrapper
      title="Actieve Setup"
      icon={<TrendingUp className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 text-sm text-[var(--text-dark)] min-h-[220px]">

        {/* LOADING */}
        {loading && <CardLoader text="Setup laden…" />}

        {/* EMPTY */}
        {!loading && !setup && (
          <p className="italic text-[var(--text-light)]">
            Geen actieve setup gevonden.
          </p>
        )}

        {/* CONTENT */}
        {!loading && setup && (
          <div className="flex flex-col gap-4 flex-1">

            {/* BASIS INFO */}
            <div className="space-y-[3px]">
              <p><strong>Naam:</strong> {setup.name || "–"}</p>
              <p><strong>Trend:</strong> {setup.trend || "–"}</p>
              <p><strong>Timeframe:</strong> {setup.timeframe || "–"}</p>
              <p><strong>Type:</strong> {setup.strategy_type || "–"}</p>
              <p><strong>Asset:</strong> {setup.symbol || "–"}</p>
            </div>

            {/* 1 REGEL PREVIEW (geen blok) */}
            <p className="text-xs italic text-[var(--text-light)] mt-auto line-clamp-1">
              {trendPreview}
            </p>
          </div>
        )}

      </div>
    </CardWrapper>
  );
}
