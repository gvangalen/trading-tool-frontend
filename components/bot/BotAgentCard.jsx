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
 * BotAgentCard — FINAL SURFACE
 * --------------------------------------------------
 * ÉÉN bot = ÉÉN card
 *
 * Structuur:
 * - Header (bot meta)
 * - Main grid:
 *   - Portfolio (context)
 *   - Decision (actie)
 * - History (toggle / accordion)
 *
 * ❌ GEEN nested cards
 * ❌ GEEN tabs
 * ✅ Rust + hiërarchie
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
     RESPONSIVE CHECK (client-safe)
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

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="card-surface w-full space-y-6">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <Header bot={bot} />

      {/* =====================================================
         MAIN CONTENT
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* -------- PORTFOLIO (CONTEXT) -------- */}
        <div>
          <BotPortfolioCard
            bot={portfolio}
            onUpdateBudget={onUpdateBudget}
          />
        </div>

        {/* -------- DECISION (ACTION) -------- */}
        <div>
          <BotDecisionCard
            bot={bot}
            decision={decision}
            loading={loadingDecision}
            onGenerate={onGenerate}
            onExecute={onExecute}
            onSkip={onSkip}
          />
        </div>
      </div>

      {/* =====================================================
         HISTORY
      ===================================================== */}
      {isMobile ? (
        /* ---------- MOBILE: ACCORDION ---------- */
        <div className="border rounded-lg overflow-hidden">
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
        /* ---------- DESKTOP: INLINE TOGGLE ---------- */
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
