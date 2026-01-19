"use client";

import CardLoader from "@/components/ui/CardLoader";
import { Play, SkipForward, Wand2, Brain } from "lucide-react";

/**
 * BotDecisionSection — TradeLayer 2.0
 * --------------------------------------------------
 * Toont de intent + huidige staat van een bot
 *
 * GEEN card / GEEN wrapper
 * → onderdeel van BotAgentSurface
 *
 * Filosofie:
 * - Laat zien WAT de bot kan beslissen
 * - Laat zien WAT hij nu denkt / doet
 * - Eén duidelijke actie
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
  const actionColor = {
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
      <div className="py-6">
        <CardLoader text="Bot analyseert markt & strategie…" />
      </div>
    );
  }

  /* =====================================================
     BOT INTENT (ALTIJD ZICHTBAAR)
  ===================================================== */
  const intent = (
    <div className="flex items-start gap-3 text-sm">
      <Brain size={16} className="mt-0.5 text-[var(--text-muted)]" />
      <div className="text-[var(--text-muted)] leading-relaxed">
        Deze bot voert automatisch een{" "}
        <span className="font-medium text-[var(--text)]">
          {bot.strategy?.name ?? "strategie"}
        </span>{" "}
        uit en kan per dag één van de volgende acties voorstellen:
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>• Accumulate</span>
          <span>• Wait</span>
          <span>• Skip</span>
        </div>
      </div>
    </div>
  );

  /* =====================================================
     GEEN BESLISSING — OBSERVING STATE
  ===================================================== */
  if (!decision) {
    return (
      <div className="space-y-5 py-4">
        {intent}

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Huidige staat
            </div>
            <div className="font-medium text-sm">
              Observing market conditions
            </div>
          </div>

          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              <Wand2 size={16} />
              {isGenerating
                ? "Analyse loopt…"
                : "Laat bot beslissen"}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =====================================================
     BESLISSING — INTENT + ACTIE
  ===================================================== */
  return (
    <div className="space-y-5 py-4">
      {intent}

      <div className="bg-[var(--surface-2)] rounded-xl p-5">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Voorstel
            </div>
            <div
              className={`text-2xl font-semibold ${
                actionColor[decision.action] ??
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
          <ul className="text-sm space-y-1 mb-4">
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
    </div>
  );
}
