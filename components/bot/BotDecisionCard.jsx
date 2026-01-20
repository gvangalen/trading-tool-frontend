"use client";

import CardLoader from "@/components/ui/CardLoader";
import {
  Play,
  SkipForward,
  ShoppingCart,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

/**
 * BotTodayProposal — TradeLayer 2.0
 * --------------------------------------------------
 * ÉÉN waarheid voor vandaag:
 * - Dit IS de decision
 * - Execute = bevestigen (ook bij OBSERVE)
 * - Skip = bewust niets doen
 * - Opnieuw kijken = AI her-evaluatie
 */
export default function BotTodayProposal({
  bot,
  decision = null,
  order = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onExecute,
  onSkip,
}) {
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
     INTENT (KLEIN & CONTEXTUEEL)
  ===================================================== */
  const intent = (
    <div className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
      <ShoppingCart size={16} className="mt-0.5" />
      <div>
        Deze bot voert automatisch de{" "}
        <span className="font-medium text-[var(--text)]">
          {bot.strategy?.name ?? "strategie"}
        </span>{" "}
        uit en doet maximaal één voorstel per dag.
      </div>
    </div>
  );

  /* =====================================================
     GEEN ORDER VANDAAG (OBSERVE / HOLD)
  ===================================================== */
  if (!order) {
    return (
      <div className="space-y-5 py-4">
        {intent}

        <div className="bg-[var(--surface-2)] rounded-xl p-5">
          <div className="text-sm font-medium mb-2">
            Geen order gepland voor vandaag
          </div>

          {decision?.reasons?.length > 0 && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              {decision.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          )}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={onExecute}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={16} />
              Execute
            </button>

            <button
              onClick={onSkip}
              className="btn-secondary flex items-center gap-2"
            >
              <SkipForward size={16} />
              Skip
            </button>

            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="btn-ghost flex items-center gap-2"
              >
                <RotateCcw size={14} />
                {isGenerating
                  ? "Analyse loopt…"
                  : "Laat bot opnieuw kijken"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ORDER PREVIEW = DE BESLISSING
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
            <div className="text-2xl font-semibold">
              {order.side?.toUpperCase()} {order.symbol}
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-[var(--text-muted)]">
              Confidence
            </div>
            <div className="font-semibold">
              {decision?.confidence?.toUpperCase() ?? "—"}
            </div>
          </div>
        </div>

        {/* ⚠️ PAPER NOTICE */}
        <div className="flex items-center gap-2 mb-4 text-xs icon-warning">
          <AlertTriangle size={14} />
          <span>
            Dit is een <b>paper trade</b>. Er wordt niets live verhandeld.
          </span>
        </div>

        {/* ORDER DETAILS */}
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[var(--text-muted)]">Bedrag</div>
            <div className="font-medium">
              €{order.quote_amount_eur}
            </div>
          </div>

          <div>
            <div className="text-[var(--text-muted)]">
              Geschatte prijs
            </div>
            <div className="font-medium">
              €{order.estimated_price ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-[var(--text-muted)]">
              Hoeveelheid
            </div>
            <div className="font-medium">
              {order.estimated_qty ?? "—"} BTC
            </div>
          </div>

          <div>
            <div className="text-[var(--text-muted)]">
              Status
            </div>
            <div className="font-medium">
              {order.status}
            </div>
          </div>
        </div>

        {/* BUDGET IMPACT */}
        {order.budget_after && (
          <div className="mt-4 text-sm text-[var(--text-muted)]">
            <div>Na deze trade:</div>
            <ul className="mt-1 space-y-1">
              <li>
                • Daglimiet resterend: €
                {order.budget_after.daily_remaining}
              </li>
              <li>
                • Totaal budget resterend: €
                {order.budget_after.total_remaining}
              </li>
            </ul>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={onExecute}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={16} />
            Execute trade
          </button>

          <button
            onClick={onSkip}
            className="btn-secondary flex items-center gap-2"
          >
            <SkipForward size={16} />
            Skip
          </button>

          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-ghost flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Laat bot opnieuw kijken
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
