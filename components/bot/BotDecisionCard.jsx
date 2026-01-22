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
  Bot,
} from "lucide-react";

/**
 * BotTodayProposal — TradeLayer 2.5 (AUTO MODE READY)
 * --------------------------------------------------
 * Intentie-gedreven decision layer:
 * - Wat zoekt de bot?
 * - Past dit binnen het risk profile?
 * - Wel / geen trade = logisch gevolg
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

  const isAuto = bot?.mode === "auto";
  const executedByAuto = decision?.executed_by === "auto";

  const setup = decision?.setup_match ?? null;
  const confidence = decision?.confidence ?? "low";
  const riskProfile = bot?.risk_profile ?? null;

  /* =====================================================
     HEADER
  ===================================================== */
  const header = (
    <div className="space-y-2">
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

      {/* BOT MODE + RISK PROFILE */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-1">
          <Bot size={12} />
          Bot mode:{" "}
          <span className="font-medium uppercase text-[var(--text)]">
            {bot?.mode ?? "manual"}
          </span>
        </div>

        {riskProfile && (
          <div>
            · Risk profile bot:{" "}
            <span className="font-medium capitalize text-[var(--text)]">
              {riskProfile}
            </span>
          </div>
        )}
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
            ? "Automatisch uitgevoerd door bot"
            : "Vandaag uitgevoerd"}
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
     MINI SETUP CARD — INTENTIE
  ===================================================== */
  const setupCard = setup && (
    <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Layers size={14} />
        Bot zoekt vandaag
      </div>

      <div className="font-semibold">
        {setup.name} · {setup.symbol} · {setup.timeframe}
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-red-500"
          style={{ width: `${Math.min(setup.score, 100)}%` }}
        />
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Score: {setup.score} / 100 · Confidence{" "}
        <span className="uppercase font-medium">{confidence}</span>
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
          <div className="font-medium">Geen trade gepland voor vandaag</div>

          <div className="text-sm text-[var(--text-muted)]">
            De huidige marktcondities passen niet binnen het gekozen risk profile.
          </div>

          {setupCard}
          {finalStatus}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {/* MANUAL / SEMI ONLY */}
            {!isAuto && !isFinal && (
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

            {/* ALTIJD TOEGESTAAN */}
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
        <div className="text-2xl font-semibold">
          {(order.side ?? "buy").toUpperCase()} {order.symbol}
        </div>

        {setupCard}
        {finalStatus}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 pt-4">
          {/* MANUAL / SEMI ONLY */}
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

          {/* ALTIJD */}
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
