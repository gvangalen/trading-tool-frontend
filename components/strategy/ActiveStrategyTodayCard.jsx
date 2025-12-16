"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { Target, Shield, TrendingUp } from "lucide-react";
import { useActiveStrategyToday } from "@/hooks/useAgentData";

export default function ActiveStrategyTodayCard() {
  const { strategy, loading } = useActiveStrategyToday();

  if (loading) {
    return (
      <CardWrapper>
        <p className="text-sm text-[var(--text-light)]">
          Actieve strategie laden…
        </p>
      </CardWrapper>
    );
  }

  if (!strategy) {
    return (
      <CardWrapper>
        <p className="text-sm text-[var(--text-light)]">
          Geen actieve strategie voor vandaag.
        </p>
      </CardWrapper>
    );
  }

  const {
    setup_name,
    symbol,
    timeframe,
    entry,
    targets,
    stop_loss,
    adjustment_reason,
    confidence_score,
  } = strategy;

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
        <h2 className="text-lg font-semibold text-[var(--text-dark)]">
          Actieve Strategie Vandaag
        </h2>
      </div>

      {/* Meta */}
      <p className="text-sm text-[var(--text-light)] mb-4">
        {setup_name} · {symbol} · {timeframe}
      </p>

      {/* Entry */}
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Entry:</strong> {entry}
        </span>
      </div>

      {/* Targets */}
      {targets && (
        <div className="mb-3">
          <p className="text-sm font-medium text-[var(--text-dark)] mb-1">
            Targets
          </p>
          <ul className="ml-4 space-y-1">
            {targets.split(",").map((t, i) => (
              <li key={i} className="text-sm text-[var(--text-dark)]">
                • {t.trim()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stop loss */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-red-500" />
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Stop-loss:</strong> {stop_loss}
        </span>
      </div>

      {/* Adjustment reason */}
      {adjustment_reason && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Aanpassing:</strong> {adjustment_reason}
        </p>
      )}

      {/* Confidence */}
      {confidence_score !== null && confidence_score !== undefined && (
        <p className="text-xs text-[var(--text-light)]">
          Confidence score:{" "}
          <strong className="text-[var(--text-dark)]">
            {confidence_score}%
          </strong>
        </p>
      )}
    </CardWrapper>
  );
}
