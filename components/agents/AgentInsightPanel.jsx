"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { useAgentInsight } from "@/hooks/useAgentInsight";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AgentInsightPanel({ category }) {
  const { data, loading } = useAgentInsight(category);

  if (loading) {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">AI-analyse wordt geladen…</p>
      </CardWrapper>
    );
  }

  if (!data) {
    return (
      <CardWrapper>
        <p className="text-[var(--text-light)] text-sm">Nog geen AI-analyse beschikbaar.</p>
      </CardWrapper>
    );
  }

  const {
    avg_score,
    trend,
    bias,
    risk,
    summary,
    top_signals,
  } = data;

  const trendIcon =
    trend === "bullish" ? <TrendingUp className="text-green-500" /> :
    trend === "bearish" ? <TrendingDown className="text-red-500" /> :
    <Minus className="text-yellow-500" />;

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-[var(--text-dark)]" />
        <h2 className="text-sm font-semibold text-[var(--text-dark)]">
          AI {category.charAt(0).toUpperCase() + category.slice(1)} Analyse
        </h2>
      </div>

      {/* Trend / Bias / Risk */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {trendIcon}
          <span className="text-sm text-[var(--text-dark)] capitalize">{trend}</span>
        </div>

        <div className="text-xs text-[var(--text-light)]">
          Bias: <strong className="capitalize">{bias}</strong>
        </div>

        <div className="text-xs text-[var(--text-light)]">
          Risico: <strong className="capitalize">{risk}</strong>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--text-dark)] leading-relaxed mb-4">
        {summary}
      </p>

      {/* Top signals */}
      {top_signals?.length > 0 && (
        <div>
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
    </CardWrapper>
  );
}
