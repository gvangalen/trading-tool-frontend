"use client";

import CardLoader from "@/components/ui/CardLoader";
import { Play, SkipForward, Wand2 } from "lucide-react";

/**
 * BotDecisionSection
 * ----------------------------------------
 * Toont de DAGELIJKSE intent / beslissing van één bot
 *
 * ⚠️ GEEN card / geen wrapper
 * → bedoeld als section binnen BotAgentSurface
 *
 * Props:
 * - bot
 * - decision: decision object | null
 * - loading: boolean
 * - isGenerating: boolean
 * - onGenerate
 * - onExecute
 * - onSkip
 */
export default function BotDecisionSection({
  bot,
  decision = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onExecute,
  onSkip,
}) {
  const actionClass = {
    buy: "text-green-600",
    sell: "text-red-600",
    hold: "text-yellow-600",
    observe: "text-[var(--text-muted)]",
  };

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="py-4">
        <CardLoader text="Beslissing ophalen…" />
      </div>
    );
  }

  /* =====================================================
     GEEN BESLISSING → GENERATE
  ===================================================== */
  if (!decision) {
    return (
      <div className="flex items-center justify-between gap-4 py-4">
        <p className="text-sm text-[var(--text-muted)]">
          Vandaag is er nog geen beslissing genomen voor deze bot.
        </p>

        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2"
          >
            <Wand2 size={16} />
            {isGenerating ? "Genereren…" : "Genereer decision"}
          </button>
        )}
      </div>
    );
  }

  /* =====================================================
     BESLISSING / INTENT
  ===================================================== */
  return (
    <div className="bg-[var(--surface-2)] rounded-[var(--radius-md)] p-5">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs text-[var(--text-muted)]">
            {decision.symbol}
          </div>

          <div
            className={`text-2xl font-semibold ${
              actionClass[decision.action] ??
              "text-[var(--text-muted)]"
            }`}
          >
            {decision.action.toUpperCase()}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)]">
            Confidence
          </div>
          <div className="font-semibold">
            {decision.confidence.toUpperCase()}
          </div>
        </div>
      </div>

      {/* REDENEN */}
      {decision.reasons?.length > 0 && (
        <ul className="text-sm space-y-1 mb-5">
          {decision.reasons.map((r, i) => (
            <li key={i} className="text-[var(--text-muted)]">
              • {r}
            </li>
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
  );
}
