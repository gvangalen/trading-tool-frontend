"use client";

import CardLoader from "@/components/ui/CardLoader";
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
 * BotTodayProposal — TradeLayer 2.5 (FINAL)
 *
 * - Strategy vs markt card is ALTIJD zichtbaar
 * - Strategy ≠ trade (belangrijk!)
 * - Backend is single source of truth
 * - Laatste analyse timestamp zichtbaar
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
     ⏱️ LAATSTE ANALYSE (backend decision_ts)
  ===================================================== */
  const decisionTime =
    decision?.decision_ts ? new Date(decision.decision_ts) : null;

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
     SETUP MATCH (backend leidend)
  ===================================================== */
  const setupMatch =
    decision?.setup_match ?? {
      name: "Strategy",
      symbol: decision?.symbol ?? "BTC",
      timeframe: "—",
      score:
        typeof decision?.scores?.combined === "number"
          ? decision.scores.combined
          : 10,
      confidence,
      thresholds: null,
      status: "no_snapshot",
      reason: "Geen strategy context beschikbaar voor vandaag",
    };

  const score =
    typeof setupMatch.score === "number" && setupMatch.score > 0
      ? setupMatch.score
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
     STRATEGY vs MARKT CARD (ALTIJD)
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

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Bot score:{" "}
        <span className="font-medium">{score} / 100</span> · Confidence{" "}
        <span className="uppercase font-medium">{confidence}</span>
      </div>

      {setupMatch.thresholds && (
        <div className="text-xs text-[var(--text-muted)]">
          Drempels: buy ≥ {setupMatch.thresholds.buy} · hold ≥{" "}
          {setupMatch.thresholds.hold}
        </div>
      )}

      <div className="text-xs text-gray-500 italic">
        {setupMatch.status === "no_snapshot" &&
          "Geen strategy context beschikbaar voor vandaag"}

        {setupMatch.status === "below_threshold" &&
          "Strategy actief, maar score te laag voor trade"}

        {setupMatch.status === "match_hold" &&
          "Strategy valide, maar geen koopmoment"}

        {setupMatch.status === "match_buy" &&
          "Voldoet aan voorwaarden voor trade"}
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
            De huidige marktscore voldoet niet aan de voorwaarden voor een trade.
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
                className="btn-ghost flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Analyse opnieuw uitvoeren
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
              className="btn-ghost flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Analyse opnieuw uitvoeren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
