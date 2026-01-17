"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { BarChart3 } from "lucide-react";

export default function BotScores({
  scores = {},
  loading = false,
}) {
  const hasScores =
    scores && Object.keys(scores).length > 0;

  return (
    <CardWrapper
      title="Scores"
      icon={<BarChart3 className="icon icon-primary" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Scores laden…" />
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !hasScores && (
        <p className="text-sm text-[var(--text-muted)]">
          Nog geen scores beschikbaar voor vandaag.
        </p>
      )}

      {/* ===================== */}
      {/* SCORES */}
      {/* ===================== */}
      {!loading && hasScores && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(scores).map(([key, value]) => {
            const score = Number(value) || 0;

            let colorClass = "text-[var(--text-muted)]";
            if (score >= 70) colorClass = "score-strong-buy";
            else if (score <= 35) colorClass = "score-sell";

            return (
              <div
                key={key}
                className="
                  rounded-[var(--radius-sm)]
                  bg-[var(--surface-2)]
                  border border-[var(--border)]
                  p-4 text-center
                "
              >
                <div className="text-sm text-[var(--text-muted)] capitalize">
                  {key}
                </div>

                <div className={`text-2xl font-semibold ${colorClass}`}>
                  {score}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardWrapper>
  );
}
