"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { Brain, Play, SkipForward, Wand2 } from "lucide-react";

/**
 * BotDecisionCard
 * ----------------------------------------
 * Toont de DAGELIJKSE beslissing van ÉÉN bot
 *
 * Props:
 * - bot: bot config object
 * - decision: decision object | null
 * - loading: boolean                → algemene load (today)
 * - isGenerating: boolean           → specifieke bot generate state
 * - onGenerate: () => void
 * - onExecute: ({ bot_id, report_date }) => void
 * - onSkip: ({ bot_id, report_date }) => void
 */
export default function BotDecisionCard({
  bot,
  decision = null,
  loading = false,
  isGenerating = false,
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
      title={bot?.name ?? "Bot decision"}
      subtitle={bot?.strategy?.type?.toUpperCase()}
      icon={<Brain className="icon icon-primary" />}
    >
      {/* ===================== */}
      {/* LOADING (GLOBAL TODAY) */}
      {/* ===================== */}
      {loading && <CardLoader text="Beslissing ophalen…" />}

      {/* ===================== */}
      {/* GEEN BESLISSING → GENERATE */}
      {/* ===================== */}
      {!loading && !decision && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Voor deze bot is vandaag nog geen beslissing genomen.
          </p>

          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              <Wand2 size={16} />
              {isGenerating
                ? "Genereren…"
                : "Genereer decision"}
            </button>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* BESLISSING */}
      {/* ===================== */}
      {!loading && decision && (
        <div className="bg-[var(--surface-2)] rounded-[var(--radius-md)] p-4">
          {/* HEADER */}
          <div className="flex justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--text-muted)]">
                {decision.symbol}
              </div>
              <div
                className={`text-2xl font-semibold ${
                  actionClass[decision.action] ||
                  "text-[var(--text-muted)]"
                }`}
              >
                {decision.action.toUpperCase()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)]">
                Confidence
              </div>
              <div className="font-semibold">
                {decision.confidence.toUpperCase()}
              </div>
            </div>
          </div>

          {/* REDENEN */}
          {decision.reasons?.length > 0 && (
            <ul className="text-sm space-y-1 mb-4">
              {decision.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          )}

          {/* ACTIES */}
          <div className="flex gap-2">
            {onExecute && (
              <button
                onClick={() =>
                  onExecute({
                    bot_id: decision.bot_id,
                    report_date: decision.date,
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
                    report_date: decision.date,
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
