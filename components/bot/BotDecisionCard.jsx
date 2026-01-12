"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { Brain, Play, SkipForward } from "lucide-react";

/**
 * BotDecisionCard
 * --------------------------------------------------
 * Toont beslissingen van vandaag per bot
 *
 * Props:
 * - today: { date, decisions[], orders[] }
 * - loading: boolean
 * - onGenerate(): generate today
 * - onExecute({ bot_id, report_date })
 * - onSkip({ bot_id, report_date })
 */
export default function BotDecisionCard({
  today = null,
  loading = false,
  onGenerate,
  onExecute,
  onSkip,
}) {
  const decisions = today?.decisions ?? [];
  const reportDate = today?.date;

  const actionClass = {
    buy: "score-buy",
    hold: "score-neutral",
    sell: "score-sell",
    observe: "text-[var(--text-muted)]",
  };

  return (
    <CardWrapper
      title="Bot Decision Today"
      icon={<Brain className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Beslissingen ophalen…" />
      )}

      {/* ===================== */}
      {/* EMPTY */}
      {/* ===================== */}
      {!loading && decisions.length === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Er is vandaag nog geen bot-beslissing gegenereerd.
          </p>

          {onGenerate && (
            <button
              onClick={onGenerate}
              className="btn-primary"
            >
              Genereer beslissing
            </button>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* DECISIONS */}
      {/* ===================== */}
      {!loading &&
        decisions.length > 0 &&
        decisions.map((d) => (
          <div
            key={d.id}
            className="border rounded-xl p-4 mb-4 bg-[var(--card-muted)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-[var(--text-muted)]">
                  Bot #{d.bot_id} · {d.symbol}
                </div>
                <div
                  className={`text-2xl font-semibold ${
                    actionClass[d.action] ||
                    "text-[var(--text-dark)]"
                  }`}
                >
                  {String(d.action).toUpperCase()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-[var(--text-muted)]">
                  Confidence
                </div>
                <div className="font-semibold">
                  {String(d.confidence).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Reasons */}
            {d.reasons?.length > 0 && (
              <ul className="text-sm space-y-1 mb-4">
                {d.reasons.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {onExecute && (
                <button
                  onClick={() =>
                    onExecute({
                      bot_id: d.bot_id,
                      report_date: reportDate,
                    })
                  }
                  className="btn-primary flex items-center gap-2"
                >
                  <Play size={16} />
                  Execute
                </button>
              )}

              {onSkip && (
                <button
                  onClick={() =>
                    onSkip({
                      bot_id: d.bot_id,
                      report_date: reportDate,
                    })
                  }
                  className="btn-secondary flex items-center gap-2"
                >
                  <SkipForward size={16} />
                  Skip
                </button>
              )}
            </div>
          </div>
        ))}
    </CardWrapper>
  );
}
