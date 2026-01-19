"use client";

import { useState, useEffect } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";

import {
  Brain,
  MoreVertical,
  ChevronDown,
  Clock,
} from "lucide-react";

/**
 * BotAgentCard — FINAL (TradeLayer 2.0)
 * --------------------------------------------------
 * ÉÉN bot = ÉÉN surface
 *
 * Structuur:
 * - Header (bot meta)
 * - State bar (decision context)
 * - Main grid:
 *   - Decision (actie, dominant)
 *   - Portfolio (context, rustig)
 * - History (progressief: toggle / accordion)
 *
 * ❌ Geen nested cards
 * ❌ Geen tabs
 * ❌ Geen visuele chaos
 */
export default function BotAgentCard({
  bot,
  decision,
  portfolio,
  history = [],
  loadingDecision = false,

  onGenerate,
  onExecute,
  onSkip,
  onUpdateBudget,
}) {
  if (!bot || !portfolio) return null;

  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* =====================================================
     RESPONSIVE CHECK
  ===================================================== */
  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches
      );

    check();
    window.addEventListener("resize", check);
    return () =>
      window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <Header bot={bot} />

      {/* =====================================================
         STATE BAR (MENTAL ANCHOR)
      ===================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-soft)] rounded-xl px-4 py-3">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Huidige status
            </div>
            <div className="font-semibold text-sm">
              {decision
                ? decision.action.toUpperCase()
                : "GEEN BESLISSING"}
            </div>
          </div>

          {decision && (
            <div>
              <div className="text-xs text-[var(--text-muted)]">
                Confidence
              </div>
              <div className="font-semibold text-sm">
                {decision.confidence.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        <div>
          {decision ? (
            <button
              onClick={() =>
                onExecute?.({
                  bot_id: decision.bot_id,
                  report_date: decision.date,
                })
              }
              className="btn-primary"
            >
              Execute
            </button>
          ) : (
            <button
              onClick={onGenerate}
              disabled={loadingDecision}
              className="btn-primary"
            >
              {loadingDecision
                ? "Genereren…"
                : "Genereer decision"}
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
         MAIN CONTENT
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* -------- DECISION (PRIMARY) -------- */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Decision
          </div>

          <BotDecisionCard
            bot={bot}
            decision={decision}
            loading={loadingDecision}
            onGenerate={onGenerate}
            onExecute={onExecute}
            onSkip={onSkip}
          />
        </div>

        {/* -------- PORTFOLIO (CONTEXT) -------- */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Portfolio
          </div>

          <BotPortfolioCard
            bot={portfolio}
            onUpdateBudget={onUpdateBudget}
          />
        </div>
      </div>

      {/* =====================================================
         HISTORY
      ===================================================== */}
      {isMobile ? (
        /* ---------- MOBILE ---------- */
        <div className="border rounded-xl overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <Clock size={14} />
              History
            </span>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                showHistory ? "rotate-180" : ""
              }`}
            />
          </button>

          {showHistory && (
            <div className="p-4 bg-[var(--bg-soft)]">
              <BotHistoryTable
                history={history.filter(
                  (h) => h.bot_id === bot.id
                )}
                compact
              />
            </div>
          )}
        </div>
      ) : (
        /* ---------- DESKTOP ---------- */
        <div className="pt-2 border-t">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2"
          >
            <Clock size={14} />
            {showHistory
              ? "Verberg history"
              : "Toon history"}
          </button>

          {showHistory && (
            <div className="pt-4">
              <BotHistoryTable
                history={history.filter(
                  (h) => h.bot_id === bot.id
                )}
                compact
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   HEADER
===================================================== */
function Header({ bot }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="icon-primary">
          <Brain size={18} />
        </div>

        <div>
          <div className="font-semibold leading-tight">
            {bot.name}
          </div>

          <div className="text-xs text-[var(--text-muted)]">
            {bot.strategy?.name ?? "—"} · {bot.symbol} ·{" "}
            {bot.timeframe ?? "—"}
          </div>
        </div>
      </div>

      <button className="icon-muted hover:icon-primary">
        <MoreVertical size={16} />
      </button>
    </div>
  );
}
