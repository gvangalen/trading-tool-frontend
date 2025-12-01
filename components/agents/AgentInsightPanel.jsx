"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { useAgentData } from "@/hooks/useAgentData";

import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export default function AgentInsightPanel({ category }) {
  const { insight, reflections, loading } = useAgentData(category);

  /* ===========================================================
     1) LOADING STATE
  ============================================================ */
  if (loading) {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">
          AI-analyse wordt geladen…
        </p>
      </CardWrapper>
    );
  }

  /* ===========================================================
     2) GEEN INSIGHTS → SAFE FALLBACK
  ============================================================ */
  if (!insight || typeof insight !== "object") {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">
          Geen AI-analyse beschikbaar voor deze categorie.
        </p>
      </CardWrapper>
    );
  }

  /* ===========================================================
     3) VEILIG DESTRUCTUREN (met fallbacks)
  ============================================================ */
  const {
    avg_score = "–",
    trend = "neutral",
    bias = "–",
    risk = "–",
    summary = null,
    top_signals = [],
  } = insight;

  /* ===========================================================
     4) TREND ICON
  ============================================================ */
  const trendIcon =
    trend === "bullish" ? (
      <TrendingUp className="text-green-500" />
    ) : trend === "bearish" ? (
      <TrendingDown className="text-red-500" />
    ) : (
      <Minus className="text-yellow-500" />
    );

  /* ===========================================================
     5) RENDER
  ============================================================ */
  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-[var(--text-dark)]" />
        <h2 className="text-sm font-semibold text-[var(--text-dark)]">
          AI {category.charAt(0).toUpperCase() + category.slice(1)} Analyse
        </h2>
      </div>

      {/* Score + Trend + Bias + Risk */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          {trendIcon}
          <span className="text-sm text-[var(--text-dark)] capitalize">
            {trend}
          </span>
        </div>

        <div className="text-xs text-[var(--text-light)]">
          Bias:{" "}
          <strong className="capitalize text-[var(--text-dark)]">
            {bias}
          </strong>
        </div>

        <div className="text-xs text-[var(--text-light)]">
          Risico:{" "}
          <strong className="capitalize text-[var(--text-dark)]">
            {risk}
          </strong>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-[var(--text-dark)] leading-relaxed mb-4">
          {summary}
        </p>
      )}

      {/* Top Signals */}
      {Array.isArray(top_signals) && top_signals.length > 0 && (
        <div className="mt-1">
          <p className="text-xs font-semibold text-[var(--text-light)] uppercase mb-1">
            Belangrijkste signalen
          </p>

          <ul className="ml-2 space-y-1">
            {top_signals.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-dark)]">
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reflections */}
      {Array.isArray(reflections) && reflections.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-[var(--text-light)] uppercase mb-2">
            Reflecties per indicator
          </p>

          <div className="space-y-2">
            {reflections.map((r, i) => (
              <div
                key={i}
                className="
                  p-3 rounded-lg border border-[var(--card-border)]
                  bg-[var(--bg-soft)] shadow-sm
                "
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[var(--text-dark)] capitalize">
                    {r.indicator ?? "Onbekend"}
                  </span>
                  <span className="text-xs text-[var(--text-light)]">
                    Score: {r.ai_score ?? "–"} | Discipline:{" "}
                    {r.compliance ?? "–"}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-dark)]">
                  {r.comment ?? "Geen commentaar"}
                </p>

                {r.recommendation && (
                  <p className="text-xs text-[var(--text-light)] italic mt-1">
                    {r.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </CardWrapper>
  );
}
