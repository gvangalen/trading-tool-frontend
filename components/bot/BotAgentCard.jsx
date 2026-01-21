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
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 2.2 (FINAL)
 * --------------------------------------------------
 * ÉÉN bot = ÉÉN agent surface
 *
 * Principes:
 * - Strategy + mode + risk profile altijd zichtbaar
 * - Decision = voorstel van vandaag (incl. order preview)
 * - State bar = context (geen actie)
 * - Portfolio = rustig, secundair
 * - Acties lopen via BotPage (snackbar / UX feedback)
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

  const MODES = ["auto", "semi", "manual"];

  const modeLabel = {
    auto: "Auto",
    semi: "Semi",
    manual: "Manual",
  };

  const modeClass = (mode) =>
    bot.mode === mode
      ? "bg-blue-600 text-white"
      : "bg-gray-100 text-gray-600";

  /* =====================================================
     RISK PROFILE UI
  ===================================================== */
  const riskProfile = bot.risk_profile ?? "balanced";

  const riskConfig = {
    conservative: {
      label: "Conservative",
      icon: <Shield size={12} />,
      className:
        "bg-green-100 text-green-700 border-green-200",
    },
    balanced: {
      label: "Balanced",
      icon: <Scale size={12} />,
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    aggressive: {
      label: "Aggressive",
      icon: <Rocket size={12} />,
      className:
        "bg-red-100 text-red-700 border-red-200",
    },
  };

  const risk = riskConfig[riskProfile] ?? riskConfig.balanced;

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
              {bot.name}
            </div>

            <div className="text-xs text-[var(--text-muted)]">
              {bot.symbol} · {bot.timeframe ?? "—"}
            </div>

            {/* STRATEGY */}
            <div className="mt-2 text-xs">
              <span className="text-[var(--text-muted)]">
                Strategy:
              </span>{" "}
              <span className="font-medium">
                {bot.strategy?.name ?? "—"}
              </span>
            </div>

            {/* MODE (READ-ONLY) */}
            <div className="flex gap-2 mt-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  className={`px-3 py-1 rounded-md text-xs transition ${modeClass(
                    m
                  )}`}
                  disabled
                >
                  {modeLabel[m]}
                </button>
              ))}
            </div>

            {/* RISK PROFILE */}
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${risk.className}`}
                title="Risk profile bepaalt hoe agressief de bot handelt"
              >
                {risk.icon}
                {risk.label}
              </span>
            </div>
          </div>
        </div>

        <button className="icon-muted hover:icon-primary">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* =====================================================
         STATE BAR — CONTEXT
      ===================================================== */}
      <div className="bg-[var(--bg-soft)] rounded-xl px-4 py-3 text-sm">
        <span className="text-[var(--text-muted)]">
          Huidige status:
        </span>{" "}
        <span className="font-semibold">
          {decision
            ? decision.action.toUpperCase()
            : "GEEN VOORSTEL"}
        </span>

        {decision?.confidence && (
          <>
            {" "}
            · Confidence{" "}
            <span className="font-semibold">
              {decision.confidence.toUpperCase()}
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
            onGenerate={onGenerate}
            onExecute={() =>
              onExecute({
                bot_id: bot.id,
              })
            }
            onSkip={() =>
              onSkip({
                bot_id: bot.id,
              })
            }
          />
        </div>

        {/* PORTFOLIO */}
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
