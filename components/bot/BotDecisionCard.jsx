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
 * --------------------------------------------------
 * Decision card = UITKOMST VAN VANDAAG
 *
 * - Bot score vs markt
 * - Wel / geen trade
 * - Auto uitgevoerd of niet
 *
 * ❌ GEEN bot mode
 * ❌ GEEN risk profile
 * ❌ GEEN strategy context
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
     HEADER (NEUTRAAL)
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
     BOT SCORE CARD — STRATEGY vs MARKT
  ===================================================== */
  const botScoreCard = decision ? (
    <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Layers size={14} />
        Strategy match vandaag
      </div>

      <div className="font-semibold">
        {decision.strategy_name ?? "Strategy"} ·{" "}
        {decision.symbol} · {decision.timeframe}
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-red-500"
          style={{
            width: `${Math.min(decision.score ?? 0, 100)}%`,
          }}
        />
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Bot score:{" "}
        <span className="font-medium">
          {decision.score ?? "–"} / 100
        </span>{" "}
        · Confidence{" "}
        <span className="uppercase font-medium">
          {confidence}
        </span>
      </div>
    </div>
  ) : (
    <div className="rounded-lg border bg-white p-4 text-sm text-gray-600 flex items-center gap-2">
      <XCircle size={14} />
      Geen bot score beschikbaar voor vandaag
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

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {!isAuto && !isFinal && (
              <>
                <button
                  onClick={onExecute}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play size={16} />
                  Bevestig
                </button>

                <button
                  onClick={onSkip}
                  className="btn-secondary flex items-center gap-2"
                >
                  <SkipForward size={16} />
                  Sla over
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
     TRADE VOORSTEL
  ===================================================== */
  return (
    <div className="space-y-5 py-4">
      {header}

      <div className="bg-[var(--surface-2)] rounded-xl p-5 space-y-4">
        <div className="text-2xl font-semibold">
          {(order.side ?? "buy").toUpperCase()} {order.symbol}
        </div>

        {botScoreCard}
        {finalStatus}

        <div className="flex flex-wrap gap-3 pt-4">
          {!isAuto && !isFinal && (
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
