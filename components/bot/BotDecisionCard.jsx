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
  TrendingUp,
  Gauge,
} from "lucide-react";

/**
 * BotTodayProposal — TradeLayer 3.0
 *
 * Backend = single source of truth
 * Frontend toont execution context & sizing logica
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
  if (loading) {
    return (
      <div className="py-6">
        <CardLoader text="Bot analyseert markt…" />
      </div>
    );
  }

  if (!decision) return null;

  /* =====================================================
     CORE STATE
  ===================================================== */

  const botId = decision.bot_id;
  const decisionId = decision.decision_id;

  const status = decision.status ?? "planned";
  const isFinal = status === "executed" || status === "skipped";
  const executedByAuto = decision.executed_by === "auto";
  const confidence = decision.confidence ?? "low";

  /* =====================================================
     EXECUTION CONTEXT (NEW)
  ===================================================== */

  const executionMode = decision.execution_mode ?? "fixed";
  const curveName = decision.decision_curve_name;
  const multiplier = decision.exposure_multiplier ?? 1;
  const baseAmount = decision.base_amount ?? null;

  const executionLabel =
    executionMode === "custom" ? "Curve sizing actief" : "Vast bedrag";

  const allocationPreview =
    baseAmount && multiplier
      ? `€${Math.round(baseAmount * multiplier)}`
      : null;

  /* =====================================================
     TIMESTAMP
  ===================================================== */

  const decisionTime =
    decision.updated_at || decision.decision_ts || decision.created_at || null;

  const formattedDecisionTime = decisionTime
    ? new Date(decisionTime).toLocaleString("nl-NL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  /* =====================================================
     SETUP MATCH
  ===================================================== */

  const setupMatch = decision.setup_match;
  if (!setupMatch) return null;

  const score =
    typeof setupMatch.score === "number" && setupMatch.score > 0
      ? Math.min(setupMatch.score, 100)
      : 10;

  /* =====================================================
     EXECUTE GUARD
  ===================================================== */

  const hasTrade = !!order;
  const canExecute =
    !isAuto && !isFinal && hasTrade && !!onExecute && !!decisionId;

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
     EXECUTION CONTEXT CARD ⭐
  ===================================================== */

  const executionCard = (
    <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <TrendingUp size={14} />
        Position sizing
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        {executionLabel}
        {executionMode === "custom" && curveName && (
          <span className="ml-1">· {curveName}</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Gauge size={14} />
        Exposure multiplier:{" "}
        <span className="font-medium">{multiplier.toFixed(2)}×</span>
      </div>

      {allocationPreview && (
        <div className="text-xs text-[var(--text-muted)]">
          Verwachte allocatie:{" "}
          <span className="font-medium">{allocationPreview}</span>
        </div>
      )}
    </div>
  );

  /* =====================================================
     STRATEGY MATCH CARD
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
        <span className="font-medium uppercase">{confidence}</span>
      </div>

      {setupMatch.thresholds && (
        <div className="text-xs text-[var(--text-muted)]">
          Drempels: buy ≥ {setupMatch.thresholds.buy} · hold ≥{" "}
          {setupMatch.thresholds.hold}
        </div>
      )}

      <div className="text-xs italic text-gray-500">
        <div className="font-medium">{setupMatch.summary}</div>
        <div>{setupMatch.detail}</div>
      </div>
    </div>
  );

  /* =====================================================
     NO TRADE
  ===================================================== */

  if (!order) {
    return (
      <div className="space-y-5 py-4">
        {header}

        <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
          <div className="font-medium">Geen trade gepland voor vandaag</div>

          <div className="text-sm text-[var(--text-muted)]">
            {setupMatch.detail}
          </div>

          {botScoreCard}
          {executionCard}

          <div className="flex flex-wrap gap-3 pt-4">
            {!isAuto && !isFinal && onSkip && (
              <button
                onClick={() => onSkip({ bot_id: botId })}
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
     TRADE PROPOSAL
  ===================================================== */

  return (
    <div className="space-y-5 py-4">
      {header}

      <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
        <div className="text-2xl font-semibold">
          {(order.side ?? "buy").toUpperCase()} {order.symbol ?? "—"}
        </div>

        {botScoreCard}
        {executionCard}

        <div className="flex flex-wrap gap-3 pt-4">
          {canExecute && (
            <button
              onClick={() =>
                onExecute({
                  bot_id: botId,
                  decision_id: decisionId,
                })
              }
              className="btn-primary flex items-center gap-2"
            >
              <Play size={16} />
              Voer trade uit
            </button>
          )}

          {!isAuto && !isFinal && onSkip && (
            <button
              onClick={() => onSkip({ bot_id: botId })}
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
