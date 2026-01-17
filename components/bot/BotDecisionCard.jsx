"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { Brain, Play, SkipForward } from "lucide-react";

/**
 * BotDecisionCard — v2.0
 * ----------------------------------------
 * Toont ALLEEN de beslissing van de actieve bot
 *
 * Props:
 * - decision: object | null
 * - loading: boolean
 * - onGenerate: () => void
 * - onExecute: ({ bot_id, report_date }) => void
 * - onSkip: ({ bot_id, report_date }) => void
 */
export default function BotDecisionCard({
  decision = null,
  loading = false,
  onGenerate,
  onExecute,
  onSkip,
}) {
  const actionClass = {
    buy: "score-buy",
    hold: "score-neutral",
    sell: "score-sell",
    observe: "text-[var(--text-muted)]",
  };

  return (
    <CardWrapper
      title="Bot Decision Today"
      icon={<Brain className="icon icon-primary" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Beslissing ophalen…" />
      )}

      {/* ===================== */}
      {/* EMPTY (NO DECISION YET) */}
      {/* ===================== */}
      {!loading && !decision && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Voor deze bot is vandaag nog geen beslissing gegenereerd.
          </p>

          {onGenerate && (
            <button
              onClick={onGenerate}
              className="btn-primary"
            >
              Genereer beslissing voor deze bot
            </button>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* DECISION */}
      {/* ===================== */}
      {!loading && decision && (
        <div
          className="
            bg-[var(--surface-2)]
            rounded-[var(--radius-md)]
            p-4
            animate-fade-slide
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--text-muted)]">
                Bot #{decision.bot_id} · {decision.symbol}
              </div>

              <div
                className={`text-2xl font-semibold ${
                  actionClass[decision.action] ||
                  "text-[var(--text-muted)]"
                }`}
              >
                {String(decision.action).toUpperCase()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)]">
                Confidence
              </div>
              <div className="font-semibold">
                {String(decision.confidence).toUpperCase()}
              </div>
            </div>
          </div>

          {/* REASONS */}
          {decision.reasons?.length > 0 && (
            <ul className="text-sm space-y-1 mb-4 text-[var(--text-dark)]">
              {decision.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2">
            {onExecute && (
              <button
                onClick={() =>
                  onExecute({
                    bot_id: decision.bot_id,
                    report_date: decision.report_date,
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
                    bot_id: decision.bot_id,
                    report_date: decision.report_date,
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
      )}
    </CardWrapper>
  );
}
