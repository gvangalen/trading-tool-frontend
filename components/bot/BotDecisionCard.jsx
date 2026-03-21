"use client";

import CardLoader from "@/components/ui/CardLoader";
import ScoreBar from "@/components/ui/ScoreBar";

import {
  Play,
  SkipForward,
  RotateCcw,
  ShoppingCart,
  Layers,
  TrendingUp,
} from "lucide-react";

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
     LOADING / EMPTY
  ===================================================== */

  if (loading) {
    return (
      <div className="py-6">
        <CardLoader text="Bot analyseert markt…" />
      </div>
    );
  }

  if (!decision) return null;

  const botId = decision.bot_id;
  const decisionId = decision.decision_id;

  const status = decision.status ?? "planned";
  const isFinal = status === "executed" || status === "skipped";

  const confidence = decision.confidence ?? "low";

  /* =====================================================
     EXPOSURE FRAMEWORK
  ===================================================== */

  const strategyMultiplier = Number(decision.exposure_multiplier ?? 1);
  const safeStrategyMultiplier = Number.isFinite(strategyMultiplier) ? strategyMultiplier : 1;

  // 🔥 FIX: backend geeft 0–100 → frontend wil multiplier (0–1)
  const rawMarketMultiplier =
    Number(decision?.metrics?.position_size ?? 100);

  const safeMarketMultiplier = Number.isFinite(rawMarketMultiplier)
    ? rawMarketMultiplier / 100
    : 1;
    const deviation = safeStrategyMultiplier - safeMarketMultiplier;

  const deviationLabel =
    deviation > 0 ? "Higher risk"
    : deviation < 0 ? "Safer than market"
    : "Aligned";

  const deviationColor =
    deviation > 0 ? "text-red-600"
    : deviation < 0 ? "text-emerald-600"
    : "text-[var(--text-muted)]";

  /* =====================================================
     EXECUTION CONTEXT (🔥 FIXED)
  ===================================================== */

  const executionMode = decision.execution_mode || "fixed";
  const curveName = decision.decision_curve_name || null;

  // 🔥 FIX: juiste fallback chain
  const baseAmount = Number(
    decision.base_amount ??
    decision.requested_amount_eur ??
    decision.amount_eur ??
    0
  );

  const executionLabel =
    executionMode === "custom"
      ? "Curve sizing actief"
      : "Vast bedrag";

  const allocationPreview =
    baseAmount > 0
      ? `€${Math.round(baseAmount * safeStrategyMultiplier)}`
      : null;

  /* =====================================================
     TIMESTAMP
  ===================================================== */

  const decisionTime =
    decision.updated_at ||
    decision.decision_ts ||
    decision.created_at ||
    null;

  const formattedDecisionTime = decisionTime
    ? new Date(decisionTime).toLocaleString("nl-NL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  /* =====================================================
     SETUP MATCH (🔥 FIXED)
  ===================================================== */

  const setupMatch = decision.setup_match || null;

  // 🔥 FIX: correcte score fallback
  const score = (() => {
    if (typeof setupMatch?.score === "number") {
      return Math.min(setupMatch.score, 100);
    }
    if (typeof decision?.scores?.total === "number") {
      return Math.min(decision.scores.total, 100);
    }
    return 10;
  })();

  const setupName = setupMatch?.name ?? "Geen strategy match";
  const setupSymbol = setupMatch?.symbol ?? "—";
  const setupTf = setupMatch?.timeframe ?? "—";

  const summary =
    setupMatch?.summary ??
    "De bot ziet momenteel geen setup die aan de voorwaarden voldoet.";

  const detail =
    setupMatch?.detail ??
    "De bot wacht op betere marktomstandigheden.";

  /* =====================================================
     TRADE DETECTIE (🔥 BELANGRIJK FIX)
  ===================================================== */

  const hasTrade =
    !!order ||
    (
      decision.action !== "hold" &&
      Number(decision.amount_eur ?? 0) > 0
    );

  const canExecute =
    !isAuto &&
    !isFinal &&
    hasTrade &&
    !!onExecute &&
    !!decisionId;

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
     POSITION SIZING
  ===================================================== */

  const executionCard = (
    <div className="tl-card space-y-3">

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

      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)]">
          Market suggestion
        </span>
        <span className="font-medium">
          {safeMarketMultiplier.toFixed(2)}×
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)]">
          Strategy exposure
        </span>
        <span className="font-medium">
          {safeStrategyMultiplier.toFixed(2)}×
        </span>
      </div>

      <div className="flex items-start justify-between text-xs gap-2">
        <span className="text-[var(--text-muted)]">
          Deviation
        </span>

        <div className={`font-medium text-right leading-tight ${deviationColor}`}>
          <div>
            {deviation >= 0 ? "+" : ""}
            {deviation.toFixed(2)}
          </div>
          <div className="text-[11px]">
            {deviationLabel}
          </div>
        </div>
      </div>

      {allocationPreview && (
        <div className="text-xs text-[var(--text-muted)]">
          Verwachte allocatie:
          <span className="font-medium ml-1">
            {allocationPreview}
          </span>
        </div>
      )}

    </div>
  );

  /* =====================================================
     STRATEGY CARD
  ===================================================== */

  const botScoreCard = (
    <div className="tl-card space-y-2">

      <div className="flex items-center gap-2 font-medium">
        <Layers size={14} />
        Strategy match vandaag
      </div>

      <div className="font-semibold">
        {setupName} · {setupSymbol} · {setupTf}
      </div>

      {formattedDecisionTime && (
        <div className="text-xs text-[var(--text-muted)]">
          Laatste analyse: {formattedDecisionTime}
        </div>
      )}

      <ScoreBar score={score} />

      <div className="text-xs text-[var(--text-muted)]">
        Marktscore:
        <span className="font-medium ml-1">
          {score} / 100
        </span>
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Strategy discipline:
        <span className="font-medium uppercase ml-1">
          {confidence}
        </span>
      </div>

      {setupMatch?.thresholds && (
        <div className="text-xs text-[var(--text-muted)]">
          Drempels: buy ≥ {setupMatch.thresholds.buy} · hold ≥{" "}
          {setupMatch.thresholds.hold}
        </div>
      )}

      <div className="text-xs italic text-gray-500">
        <div className="font-medium">{summary}</div>
        <div>{detail}</div>
      </div>

    </div>
  );

  /* =====================================================
     ACTIONS
  ===================================================== */

  const actionButtons = (
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
          {hasTrade ? "Sla trade over" : "Sla over"}
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
  );

  /* =====================================================
     NO TRADE
  ===================================================== */

  if (!hasTrade) {
    return (
      <div className="space-y-5 py-4">
        {header}

        <div className="tl-surface space-y-4">

          <div className="font-medium">
            Geen trade gepland voor vandaag
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            {summary}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {botScoreCard}
            {executionCard}
          </div>

          {actionButtons}

        </div>
      </div>
    );
  }

  /* =====================================================
     WITH TRADE
  ===================================================== */

  return (
    <div className="space-y-5 py-4">

      {header}

      <div className="tl-surface space-y-4">

        <div className="text-2xl font-semibold">
          {(order?.side ?? decision.action ?? "buy").toUpperCase()}{" "}
          {order?.symbol ?? decision.symbol ?? "—"}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {botScoreCard}
          {executionCard}
        </div>

        {actionButtons}

      </div>

    </div>
  );
}
