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
 * BotTodayProposal — TradeLayer 2.5
 *
 * - Strategy vs markt card is ALTIJD zichtbaar
 * - Strategy ≠ trade
 * - Backend is single source of truth
 * - Laatste analyse timestamp zichtbaar (updated_at leidend)
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
     ⏱️ LAATSTE ANALYSE (BACKEND LEIDEND)
  ===================================================== */
  const decisionTime = decision?.updated_at
    ? new Date(decision.updated_at)
    : decision?.decision_ts
    ? new Date(decision.decision_ts)
    : decision?.created_at
    ? new Date(decision.created_at)
    : null;

  const formattedDecisionTime = decisionTime
    ? `${decisionTime.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} · ${decisionTime.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : null;

  /* =====================================================
     SETUP MATCH (BACKEND LEIDEND)
  ===================================================== */
  const setupMatch =
    decision?.setup_match ?? {
      name: "Strategy",
      symbol: decision?.symbol ?? "BTC",
      timeframe: "—",
      score: 10,
      thresholds: null,
      status: "no_snapshot",
      reason: "Geen strategy context beschikbaar voor vandaag",
    };

  const score =
    typeof setupMatch.score === "number" && setupMatch.score > 0
      ? Math.min(setupMatch.score, 100)
      : 10;

  /* =====================================================
     🎨 SCORE KLEUR LOGICA (UX FIX)
     Groen pas vanaf 75+
  ===================================================== */
  const scoreLevel =
    score >= 75
      ? "positive"
      : score >= 60
      ? "warning"
      : score >= 40
      ? "neutral"
      : "negative";

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
        <div>
          Maximaal één beslissing per dag op basis van de huidige marktscore.
        </div>
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
     STRATEGY vs MARKT CARD
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

      <ScoreBar score={score} level={scoreLevel} />

      {/* 👇 EXPLICIET SPLITSEN */}
      <div className="text-xs text-[var(--text-muted)] space-y-1">
        <div>
          Marktscore:{" "}
          <span className="font-medium">{score} / 100</span>
        </div>

        <div>
          Strategy discipline:{" "}
          <span
            className={`font-medium ${
              confidence === "high"
                ? "text-green-600"
                : confidence === "medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {confidence.toUpperCase()}
          </span>
        </div>
      </div>

      {setupMatch.thresholds && (
        <div className="text-xs text-[var(--text-muted)]">
          Drempels: buy ≥ {setupMatch.thresholds.buy} · hold ≥{" "}
          {setupMatch.thresholds.hold}
        </div>
      )}

      <div className="text-xs text-gray-500 italic">
        {setupMatch.status === "match_buy" &&
          "Markt en strategy discipline zijn voldoende voor een trade."}

        {setupMatch.status === "no_match" &&
          "Markt is positief, maar strategy discipline is onvoldoende voor actie."}

        {setupMatch.status === "no_snapshot" &&
          "Geen actueel strategy-plan beschikbaar voor vandaag."}
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
            De markt is positief, maar de strategie wordt vandaag onvoldoende
            consistent uitgevoerd om een trade te verantwoorden.
          </div>

          {botScoreCard}
          {finalStatus}

          <div className="flex flex-wrap gap-3 pt-4">
            {!isAuto && !isFinal && typeof onExecute === "function" && (
              <button
                onClick={onExecute}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={16} />
                Bevestig
              </button>
            )}

            {!isAuto && !isFinal && typeof onSkip === "function" && (
              <button
                onClick={onSkip}
                className="btn-secondary flex items-center gap-2"
              >
                <SkipForward size={16} />
                Sla over
              </button>
            )}

            {typeof onGenerate === "function" && (
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
          {(order?.side ?? "buy").toUpperCase()}{" "}
          {order?.symbol ?? "—"}
        </div>

        {botScoreCard}
        {finalStatus}

        <div className="flex flex-wrap gap-3 pt-4">
          {!isAuto && !isFinal && typeof onExecute === "function" && (
            <button
              onClick={onExecute}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={16} />
              Voer trade uit
            </button>
          )}

          {!isAuto && !isFinal && typeof onSkip === "function" && (
            <button
              onClick={onSkip}
              className="btn-secondary flex items-center gap-2"
            >
              <SkipForward size={16} />
              Sla trade over
            </button>
          )}

          {typeof onGenerate === "function" && (
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
