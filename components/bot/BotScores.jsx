"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { BarChart3, Loader2 } from "lucide-react";

export default function BotScores({
  scores = {},
  loading = false,
}) {
  const hasScores =
    scores && Object.keys(scores).length > 0;

  return (
    <CardWrapper
      title="Scores"
      icon={<BarChart3 className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Scores laden…</span>
        </div>
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

            let color = "text-[var(--text-muted)]";
            if (score >= 70) color = "text-green-600";
            else if (score <= 35) color = "text-red-600";

            return (
              <div
                key={key}
                className="
                  border border-[var(--border)]
                  rounded-[var(--radius-sm)]
                  p-4 text-center
                  bg-[var(--bg-soft)]
                "
              >
                <div className="text-sm text-[var(--text-muted)] capitalize">
                  {key}
                </div>

                <div className={`text-2xl font-semibold ${color}`}>
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
