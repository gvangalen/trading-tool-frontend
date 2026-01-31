"use client";

import CardLoader from "@/components/ui/CardLoader";
import ScoreBar from "@/components/ui/ScoreBar";

import {
  Play,
  SkipForward,
  RotateCcw,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";

/**
 * BotTodayProposal — TradeLayer 2.6 (BACKEND-LED)
 *
 * - Backend is SINGLE SOURCE OF TRUTH
 * - Frontend rendert alleen backend-data
 * - GEEN frontend logica voor strategy-tekst
 */
export default function BotTodayProposal({
  decision = null,
  order = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onExecute,
  onSkip,
  isAuto = false,
}) {
  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="py-6">
        <CardLoader text="Bot analyseert markt…" />
      </div>
    );
  }

  /* =====================================================
     STATE
  ===================================================== */
  const status = decision?.status ?? "planned";
  const isFinal = status === "executed" || status === "skipped";
  const executedByAuto = decision?.executed_by === "auto";
  const confidence = decision?.confidence ?? "low";

  /* =====================================================
     TIMESTAMP (BACKEND LEIDEND)
  ===================================================== */
  const decisionTime =
    decision?.updated_at ||
    decision?.decision_ts ||
    decision?.created_at ||
    null;

  const formattedDecisionTime = decisionTime
    ? new Date(decisionTime).toLocaleString("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  /* =====================================================
     SETUP MATCH (⭐ BACKEND TRUTH)
  ===================================================== */
  const setupMatch = decision?.setup_match;

  if (!setupMatch) {
    return null; // UI-contract: mag nooit gebeuren
  }

  const score =
    typeof setupMatch.score === "number" && setupMatch.score > 0
      ? Math.min(setupMatch.score, 100)
      : 10;

  /* =====================================================
     HEADER
  ===================================================== */
  const header = (
    <div className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
      <ShoppingCart size={16} className="mt-0.5" />
      <div>
        <div className="font-medium text-[var(--text)]">
          Vandaag – voorstel van de bot
        </div>
        <div>Maximaal één beslissing per dag.</div>
      </div>
    </div>
  );

  /* =====================================================
     FINAL STATUS
  ===================================================== */
  const finalStatus = isFinal && (
    <div className="pt-3 text-sm font-medium">
      {status === "executed" && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} />
          {executedByAuto
            ? "Automatisch uitgevoerd"
            : "Handmatig uitgevoerd"}
        </div>
      )}

      {status === "skipped" && (
        <div className="flex items-center gap-2 text-orange-600">
          <XCircle size={16} />
          Vandaag bewust overgeslagen
        </div>
      )}
    </div>
  );

  /* =====================================================
     STRATEGY MATCH CARD (100% BACKEND)
  ===================================================== */
  const botScoreCard = (
    <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Layers size={14} />
        Strategy match vandaag
      </div>

      <div className="font-semibold">
        {setupMatch.name} · {setupMatch.symbol} · {setupMatch.timeframe}
      </div>

      {formattedDecisionTime && (
        <div className="text-xs text-[var(--text-muted)]">
          Laatste analyse: {formattedDecisionTime}
        </div>
      )}

      <ScoreBar score={score} />

      <div className="text-xs text-[var(--text-muted)]">
        Marktscore: <span className="font-medium">{score} / 100</span>
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Strategy discipline:{" "}
        <span className="font-medium uppercase">
          {confidence}
        </span>
      </div>

      {setupMatch.thresholds && (
        <div className="text-xs text-[var(--text-muted)]">
          Drempels: buy ≥ {setupMatch.thresholds.buy} · hold ≥{" "}
          {setupMatch.thresholds.hold}
        </div>
      )}

      {/* ⭐ ENIGE STRATEGY COPY */}
      <div className="text-xs italic text-gray-500">
        <div className="font-medium">{setupMatch.summary}</div>
        <div>{setupMatch.detail}</div>
      </div>
    </div>
  );

  /* =====================================================
     GEEN TRADE VANDAAG
  ===================================================== */
  if (!order) {
    return (
      <div className="space-y-5 py-4">
        {header}

        <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
          <div className="font-medium">
            Geen trade gepland voor vandaag
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            {setupMatch.detail}
          </div>

          {botScoreCard}
          {finalStatus}

          <div className="flex flex-wrap gap-3 pt-4">
            {!isAuto && !isFinal && onExecute && (
              <button
                onClick={onExecute}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={16} />
                Bevestig
              </button>
            )}

            {!isAuto && !isFinal && onSkip && (
              <button
                onClick={onSkip}
                className="btn-secondary flex items-center gap-2"
              >
                <SkipForward size={16} />
                Sla over
              </button>
            )}

            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="btn-outline flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Nieuwe analyse uitvoeren
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     TRADE VOORSTEL
  ===================================================== */
  return (
    <div className="space-y-5 py-4">
      {header}

      <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
        <div className="text-2xl font-semibold">
          {(order?.side ?? "buy").toUpperCase()} {order?.symbol ?? "—"}
        </div>

        {botScoreCard}
        {finalStatus}

        <div className="flex flex-wrap gap-3 pt-4">
          {!isAuto && !isFinal && onExecute && (
            <button
              onClick={onExecute}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={16} />
              Voer trade uit
            </button>
          )}

          {!isAuto && !isFinal && onSkip && (
            <button
              onClick={onSkip}
              className="btn-secondary flex items-center gap-2"
            >
              <SkipForward size={16} />
              Sla trade over
            </button>
          )}

          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-outline flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Nieuwe analyse uitvoeren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
