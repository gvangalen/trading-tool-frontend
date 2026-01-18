"use client";

import { useState, useEffect } from "react";

import CardWrapper from "@/components/ui/CardWrapper";
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
 * BotAgentCard — v2.1 (final)
 * --------------------------------------------------
 * Eén bot = één horizontale agent card
 *
 * Structuur:
 * - Header (bot meta)
 * - Portfolio summary (ALTIJD zichtbaar)
 * - Decision panel (ALTIJD zichtbaar)
 * - History (tab / accordion)
 *
 * Desktop: history als tab
 * Mobile: history als accordion
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
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <CardWrapper className="space-y-6 w-full">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <Header bot={bot} />

      {/* =====================================================
         MAIN CONTENT (2-COLUMN DESKTOP)
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* -------------------------------
           PORTFOLIO (PRIMARY CONTEXT)
        -------------------------------- */}
        <div>
          <BotPortfolioCard
            bot={portfolio}
            onUpdateBudget={onUpdateBudget}
          />
        </div>

        {/* -------------------------------
           DECISION (ACTION PANEL)
        -------------------------------- */}
        <div>
          <BotDecisionCard
            bot={bot}
            decision={decision}
            loading={loadingDecision}
            onGenerate={onGenerate}
            onExecute={onExecute}
            onSkip={onSkip}
            compact
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
        /* ---------- DESKTOP: TOGGLE ---------- */
        <div className="pt-2 border-t">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2"
          >
            <Clock size={14} />
            {showHistory ? "Verberg history" : "Toon history"}
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
    </CardWrapper>
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
