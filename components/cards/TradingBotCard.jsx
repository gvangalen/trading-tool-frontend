"use client";

import { useState, useEffect } from "react";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import AILoader from "@/components/ui/AILoader";
import { fetchLastStrategy } from "@/lib/api/strategy";

export default function TradingBotCard() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchLastStrategy();
        setStrategy(data && !data.message ? data : null);
      } catch (err) {
        console.error("❌ TradingBotCard error:", err);
        setError("Kan laatste strategy niet laden");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const explanation = strategy?.ai_explanation || "";

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
          <div className="flex flex-col gap-3 flex-1">

            {/* BASIS FIELDS */}
            <div className="space-y-[2px] text-sm text-[var(--text-dark)]">
              <p><strong>Setup:</strong> {strategy.setup_name}</p>
              <p><strong>Type:</strong> {strategy.strategy_type}</p>
              <p><strong>Asset:</strong> {strategy.symbol}</p>
              <p><strong>Timeframe:</strong> {strategy.timeframe}</p>

              {strategy.entry && (
                <p><strong>Entry:</strong> {strategy.entry}</p>
              )}

              {strategy.targets && (
                <p><strong>Targets:</strong> {strategy.targets.join(", ")}</p>
              )}

              {strategy.stop_loss && (
                <p><strong>SL:</strong> {strategy.stop_loss}</p>
              )}
            </div>

            {/* AI-UITLEG */}
            {explanation && (
              <div className="mt-auto">
                <div
                  className={`
                    text-xs italic p-2 rounded-lg
                    bg-purple-100/50 dark:bg-purple-900/30
                    text-purple-700 dark:text-purple-200
                    border border-purple-200/40 dark:border-purple-800
                    transition-all duration-300
                    ${expanded ? "" : "line-clamp-2"}
                  `}
                >
                  <div className="flex items-start gap-1">
                    <Bot className="w-3 h-3 mt-[2px]" />
                    <span>{explanation}</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(!expanded)}
                  className="
                    mt-1 text-[var(--primary-dark)] text-xs
                    hover:underline flex items-center gap-1
                  "
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
            )}

          </div>
        )}
      </div>
    </CardWrapper>
  );
}
