"use client";

import CardLoader from "@/components/ui/CardLoader";
import {
  Play,
  SkipForward,
  RotateCcw,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

/**
 * BotTodayProposal — TradeLayer 2.4
 * --------------------------------------------------
 * Transparante decision layer:
 * - Laat zien WAAROM wel / geen trade
 * - Score breakdown + confidence context
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
     STATE
  ===================================================== */
  const status = decision?.status ?? "planned";
  const isFinal = status === "executed" || status === "skipped";

  const scores = decision?.scores ?? {};
  const confidence = decision?.confidence ?? "low";

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
          Deze bot volgt automatisch de{" "}
          <span className="font-medium text-[var(--text)]">
            {bot?.strategy?.name ?? "strategie"}
          </span>{" "}
          en doet maximaal één voorstel per dag.
        </div>
      </div>
    </div>
  );

  /* =====================================================
     FINAL STATUS BADGE
  ===================================================== */
  const finalStatus = isFinal && (
    <div className="pt-3 text-sm font-medium">
      {status === "executed" && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} />
          Vandaag uitgevoerd
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
     SCORE BREAKDOWN (STEP 1 CORE)
  ===================================================== */
  const scoreBreakdown = (
    <div className="bg-[var(--surface-1)] rounded-lg p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle size={14} />
        Besliscontext
      </div>

      <ul className="space-y-1 text-[var(--text-muted)]">
        <li>• Macro score: <b>{scores.macro ?? "—"}</b></li>
        <li>• Technical score: <b>{scores.technical ?? "—"}</b></li>
        <li>• Market score: <b>{scores.market ?? "—"}</b></li>
        <li>• Setup score: <b>{scores.setup ?? "—"}</b></li>
        <li>
          • Confidence:{" "}
          <b className="uppercase">{confidence}</b>
        </li>
        {bot?.risk_profile && (
          <li>
            • Risk profile:{" "}
            <b className="capitalize">{bot.risk_profile}</b>
          </li>
        )}
      </ul>

      <div className="pt-2 text-xs text-[var(--text-muted)]">
        De bot opent alleen trades wanneer de combinatie van scores
        past binnen het gekozen risk profile.
      </div>
    </div>
  );

  /* =====================================================
     GEEN ORDER VANDAAG
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
            Dit is een bewuste beslissing op basis van de huidige marktcondities.
          </div>

          {/* REASONS */}
          <ul className="text-sm text-[var(--text-muted)] space-y-1">
            {decision?.reasons?.length > 0 ? (
              decision.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))
            ) : (
              <>
                <li>• Confidence te laag</li>
                <li>• Setup niet actief of onvoldoende bevestigd</li>
              </>
            )}
          </ul>

          {/* 🔍 STEP 1: TRANSPARENCY */}
          {scoreBreakdown}

          {finalStatus}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {!isFinal && (
              <>
                <button
                  onClick={onExecute}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play size={16} />
                  Bevestig (geen trade)
                </button>

                <button
                  onClick={onSkip}
                  className="btn-secondary flex items-center gap-2"
                >
                  <SkipForward size={16} />
                  Sla vandaag over
                </button>
              </>
            )}

            {onGenerate && (
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
     ORDER / TRADE VOORSTEL
  ===================================================== */
  return (
    <div className="space-y-5 py-4">
      {header}

      <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
        {/* ORDER INFO */}
        <div className="space-y-1">
          <div className="text-sm text-[var(--text-muted)]">
            Actie
          </div>
          <div className="text-2xl font-semibold">
            {(order.side ?? "buy").toUpperCase()} {order.symbol}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
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
              Geschatte hoeveelheid
            </div>
            <div className="font-medium">
              {order.estimated_qty ?? "—"} BTC
            </div>
          </div>
        </div>

        {/* IMPACT */}
        {order.budget_after && (
          <div className="pt-2 text-sm text-[var(--text-muted)]">
            <div className="font-medium text-[var(--text)] mb-1">
              Impact na trade
            </div>
            <ul className="space-y-1">
              {order.budget_after.daily_remaining !== null && (
                <li>
                  • Daglimiet: €
                  {order.budget_after.daily_remaining} resterend
                </li>
              )}
              {order.budget_after.total_remaining !== null && (
                <li>
                  • Totaal budget: €
                  {order.budget_after.total_remaining} resterend
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 🔍 CONTEXT OOK BIJ TRADE */}
        {scoreBreakdown}

        {finalStatus}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 pt-4">
          {!isFinal && (
            <>
              <button
                onClick={onExecute}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={16} />
                Voer trade uit
              </button>

              <button
                onClick={onSkip}
                className="btn-secondary flex items-center gap-2"
              >
                <SkipForward size={16} />
                Sla trade over
              </button>
            </>
          )}

          {onGenerate && (
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
