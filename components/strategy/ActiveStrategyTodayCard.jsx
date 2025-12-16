"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { useEffect, useState } from "react";
import { Target, Shield, TrendingUp } from "lucide-react";

export default function ActiveStrategyTodayCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const res = await fetch("/api/strategy/active-today");
        if (!res.ok) throw new Error("Geen actieve strategie");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshot();
  }, []);

  if (loading) {
    return (
      <CardWrapper>
        <p className="text-sm text-[var(--text-light)]">
          Actieve strategie laden…
        </p>
      </CardWrapper>
    );
  }

  if (!data) {
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
  } = data;

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
      <div className="mb-3">
        <p className="text-sm text-[var(--text-dark)] font-medium mb-1">
          Targets
        </p>
        <ul className="ml-4 space-y-1">
          {targets?.split(",").map((t, i) => (
            <li key={i} className="text-sm text-[var(--text-dark)]">
              • {t.trim()}
            </li>
          ))}
        </ul>
      </div>

      {/* Stop loss */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-red-500" />
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Stop-loss:</strong> {stop_loss}
        </span>
      </div>

      {/* Adjustment reason */}
      {adjustment_reason && (
        <p className="text-sm text-[var(--text-dark)] mb-3">
          <strong>Aanpassing:</strong> {adjustment_reason}
        </p>
      )}

      {/* Confidence */}
      {confidence_score !== null && (
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
