"use client";

import { useState, useEffect } from "react";
import { Bot } from "lucide-react";

import CardWrapper from "@/components/ui/CardWrapper";
import AILoader from "@/components/ui/AILoader";
import { fetchLastStrategy } from "@/lib/api/strategy";

export default function TradingBotCard() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLastStrategy();
        setStrategy(data && !data.message ? data : null);
      } catch (err) {
        setError("Kan laatste strategy niet laden");
      }
      setLoading(false);
    }
    load();
  }, []);

  // Maximale 1-regel samenvatting van AI
  const oneLiner =
    strategy?.ai_summary_short ||
    strategy?.ai_explanation?.split(".")[0] || // eerste zin als fallback
    "Strategie beschikbaar.";

  return (
    <CardWrapper
      title="AI TradingBot"
      icon={<Bot className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[220px]">

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-6 flex-1">
            <AILoader variant="dots" size="md" text="Strategy laden…" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* EMPTY */}
        {!loading && !error && !strategy && (
          <p className="text-sm italic text-[var(--text-light)]">
            Nog geen strategie beschikbaar.
          </p>
        )}

        {/* CONTENT */}
        {!loading && strategy && (
          <div className="flex flex-col gap-4 flex-1">

            {/* BASISGEGEVENS */}
            <div className="space-y-[2px] text-sm text-[var(--text-dark)]">
              <p><strong>Setup:</strong> {strategy.setup_name}</p>
              <p><strong>Type:</strong> {strategy.strategy_type}</p>
              <p><strong>Asset:</strong> {strategy.symbol}</p>
              <p><strong>Timeframe:</strong> {strategy.timeframe}</p>
            </div>

            {/* 1-REGEL SHORT AI SUMMARY */}
            <p className="text-xs text-[var(--text-light)] line-clamp-1">
              {oneLiner}
            </p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
