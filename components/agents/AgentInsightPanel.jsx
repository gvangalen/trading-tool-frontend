"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { useAgentData } from "@/hooks/useAgentData";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AgentInsightPanel({ category }) {
  const { insight, reflections, loading } = useAgentData(category);

  if (loading) {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">
          AI-analyse wordt geladen…
        </p>
      </CardWrapper>
    );
  }

  if (!insight) {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">
          Geen AI-analyse beschikbaar.
        </p>
      </CardWrapper>
    );
  }

  const { score, trend, bias, risk, summary, top_signals } = insight;

  const trendIcon =
    trend === "bullish" ? (
      <TrendingUp className="text-green-500" />
    ) : trend === "bearish" ? (
      <TrendingDown className="text-red-500" />
    ) : (
      <Minus className="text-yellow-500" />
    );

  // ⭐ Normaliseer alle bullets
  const normalizeBullet = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      return Object.entries(item)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" • ");
    }
    return String(item);
  };

  const cleanSignals = Array.isArray(top_signals)
    ? top_signals.map(normalizeBullet)
    : [];

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-[var(--text-dark)]" />
        <h2 className="text-lg font-semibold text-[var(--text-dark)]">
          AI {category.charAt(0).toUpperCase() + category.slice(1)} Analyse
        </h2>
      </div>

      {/* Trend + Bias + Risk */}
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
      <p className="text-sm text-[var(--text-dark)] leading-relaxed mb-6">
        {summary}
      </p>

      {/* Top Signals */}
      {cleanSignals.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--text-light)] uppercase mb-1">
            Belangrijkste signalen
          </p>
          <ul className="ml-4 space-y-1">
            {cleanSignals.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-dark)]">
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reflecties */}
      {reflections.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-light)] uppercase mb-3">
            Reflecties per indicator
          </p>

          <div className="space-y-4">
            {reflections.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--card-border)]
                           bg-[var(--bg-soft)] shadow-sm"
              >
                {/* Titel + score */}
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-[var(--text-dark)] capitalize">
                    {r.indicator}
                  </span>

                  <span className="text-xs text-[var(--text-light)]">
                    Score: {r.ai_score} | Discipline: {r.compliance}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm text-[var(--text-dark)] mb-1">
                  {r.comment}
                </p>

                {/* Recommendation */}
                {r.recommendation && (
                  <p className="text-xs text-[var(--text-light)] italic">
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
