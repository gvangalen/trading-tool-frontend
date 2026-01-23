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
  Shield,
  Scale,
  Rocket,
  Bot,
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 2.5 (CLEAN + SAFE)
 * --------------------------------------------------
 * - Geen legacy mode toggles
 * - Auto badge alleen als bot.mode === "auto"
 * - SSR-safe matchMedia
 * - Handlers veilig (alleen callen als function)
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

  const isAuto = bot?.mode === "auto";

  /* =====================================================
     RESPONSIVE CHECK (SSR SAFE)
  ===================================================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 768px)");

    const apply = () => setIsMobile(!!mq.matches);
    apply();

    // Safari/older support
    const handler = () => apply();
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  /* =====================================================
     RISK PROFILE
  ===================================================== */
  const riskProfile = (bot?.risk_profile ?? "balanced").toLowerCase();

  const riskConfig = {
    conservative: {
      label: "Conservative",
      icon: <Shield size={12} />,
      className: "bg-green-100 text-green-700 border-green-200",
    },
    balanced: {
      label: "Balanced",
      icon: <Scale size={12} />,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    aggressive: {
      label: "Aggressive",
      icon: <Rocket size={12} />,
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const risk = riskConfig[riskProfile] ?? riskConfig.balanced;

  /* =====================================================
     STATE LABEL (NO CRASH)
  ===================================================== */
  const stateLabel = () => {
    if (!decision) return "GEEN VOORSTEL";
    if (decision.status === "executed") {
      return decision.executed_by === "auto"
        ? "AUTOMATISCH UITGEVOERD"
        : "UITGEVOERD";
    }
    if (decision.status === "skipped") return "OVERGESLAGEN";
    return (decision.action || "—").toUpperCase();
  };

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6">
      {/* =====================================================
         HEADER — IDENTITEIT
      ===================================================== */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="icon-primary">
            <Brain size={18} />
          </div>

          <div>
            <div className="font-semibold leading-tight">
              {bot?.name ?? "Bot"}
            </div>

            <div className="text-xs text-[var(--text-muted)]">
              {bot?.symbol ?? "—"} · {bot?.timeframe ?? "—"}
            </div>

            {/* STRATEGY */}
            <div className="mt-2 text-xs">
              <span className="text-[var(--text-muted)]">Strategy:</span>{" "}
              <span className="font-medium">
                {bot?.strategy?.name ?? "—"}
              </span>
            </div>

            {/* META BADGES */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* RISK PROFILE */}
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${risk.className}`}
              >
                {risk.icon}
                <span className="font-medium">Risk:</span>
                {risk.label}
              </span>

              {/* AUTO MODE */}
              {isAuto && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700">
                  <Bot size={12} />
                  Auto mode
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="icon-muted hover:icon-primary" type="button">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* =====================================================
         STATE BAR
      ===================================================== */}
      <div className="bg-[var(--bg-soft)] rounded-xl px-4 py-3 text-sm">
        <span className="text-[var(--text-muted)]">Huidige status:</span>{" "}
        <span className="font-semibold">{stateLabel()}</span>

        {decision?.confidence && (
          <>
            {" "}
            · Confidence{" "}
            <span className="font-semibold">
              {String(decision.confidence).toUpperCase()}
            </span>
          </>
        )}
      </div>

      {/* =====================================================
         MAIN GRID
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* DECISION */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Decision
          </div>

          <BotDecisionCard
            bot={bot}
            decision={decision}
            order={decision?.order ?? null}
            loading={loadingDecision}
            isAuto={isAuto}
            onGenerate={onGenerate}
            onExecute={
              !isAuto && typeof onExecute === "function"
                ? () => onExecute({ bot_id: bot.id })
                : undefined
            }
            onSkip={
              !isAuto && typeof onSkip === "function"
                ? () => onSkip({ bot_id: bot.id })
                : undefined
            }
          />
        </div>

        {/* PORTFOLIO */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Portfolio
          </div>

          <BotPortfolioCard bot={portfolio} onUpdateBudget={onUpdateBudget} />
        </div>
      </div>

      {/* =====================================================
         HISTORY
      ===================================================== */}
      {isMobile ? (
        <div className="border rounded-xl overflow-hidden">
          <button
            type="button"
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
                history={history.filter((h) => h.bot_id === bot.id)}
                compact
              />
            </div>
          )}
        </div>
      ) : (
        <div className="pt-2 border-t">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2"
          >
            <Clock size={14} />
            {showHistory ? "Verberg history" : "Toon history"}
          </button>

          {showHistory && (
            <div className="pt-4">
              <BotHistoryTable
                history={history.filter((h) => h.bot_id === bot.id)}
                compact
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
