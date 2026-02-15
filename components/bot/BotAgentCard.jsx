"use client";

import { useEffect, useRef, useState } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotTradeTable from "@/components/bot/BotTradeTable";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";
import MarketConditionsPanel from "@/components/bot/MarketConditionsPanel";

import {
  Brain,
  MoreVertical,
  Clock,
  Shield,
  Scale,
  Rocket,
  Bot,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 3.0
 */

export default function BotAgentCard({
  bot,
  decision,
  order,
  portfolio,
  history = [],
  trades = [],
  loadingDecision = false,
  onGenerate,
  onExecute,
  onSkip,
  onOpenSettings,
}) {
  if (!bot) return null;

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  const isAuto = bot?.mode === "auto";
  const isPaused = bot?.is_active === false;

  const symbol = (bot?.strategy?.symbol || bot?.symbol || "BTC").toUpperCase();
  const timeframe = bot?.strategy?.timeframe || bot?.timeframe || "—";
  const strategyName = bot?.strategy?.name || bot?.strategy?.type || "—";

  /* ================= CONFIDENCE BADGE ================= */

  const getConfidenceStyle = (confidence) => {
    const c = String(confidence || "").toLowerCase();

    if (c === "high")
      return "text-green-700 bg-green-50 border-green-200";

    if (c === "medium")
      return "text-orange-700 bg-orange-50 border-orange-200";

    return "text-yellow-700 bg-yellow-50 border-yellow-200";
  };

  /* ================= SAFE PORTFOLIO ================= */

  const safePortfolioFallback = {
    bot_id: bot.id,
    name: bot?.name ?? "Bot",
    is_active: bot?.is_active ?? true,
    mode: bot?.mode ?? "manual",
    risk_profile: bot?.risk_profile ?? "balanced",
    symbol,
    budget: {
      total_eur: 0,
      daily_limit_eur: 0,
      min_order_eur: 0,
      max_order_eur: 0,
    },
    stats: {
      net_cash_delta_eur: 0,
      net_qty: 0,
      today_spent_eur: 0,
      today_reserved_eur: 0,
      today_executed_eur: 0,
      last_price: null,
      position_value_eur: null,
    },
  };

  const effectivePortfolio = portfolio
    ? {
        ...safePortfolioFallback,
        ...portfolio,
        budget: { ...safePortfolioFallback.budget, ...(portfolio.budget || {}) },
        stats: { ...safePortfolioFallback.stats, ...(portfolio.stats || {}) },
        symbol: portfolio.symbol || safePortfolioFallback.symbol,
      }
    : safePortfolioFallback;

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSettings]);

  /* ================= RISK + STATUS ================= */

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

  const risk =
    riskConfig[String(bot?.risk_profile || "balanced").toLowerCase()] ||
    riskConfig.balanced;

  const statusConfig = isPaused
    ? {
        label: "Paused",
        icon: <PauseCircle size={12} />,
        className: "bg-gray-100 text-gray-600 border-gray-300",
      }
    : {
        label: "Active",
        icon: <PlayCircle size={12} />,
        className: "bg-green-100 text-green-700 border-green-200",
      };

  /* ================= MARKET SCORES ================= */

  const marketScores = bot?.market_scores || {
    health: decision?.market_health ?? 50,
    transition_risk: decision?.transition_risk ?? 50,
    pressure: decision?.market_pressure ?? 50,
    exposure_multiplier: decision?.exposure_multiplier ?? 1,
  };

  /* ================= RENDER ================= */

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6 relative">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="icon-primary">
            <Brain size={18} />
          </div>

          <div>
            <div className="font-semibold">{bot?.name ?? "Bot"}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {symbol} · {timeframe}
            </div>

            <div className="mt-2 text-xs">
              <span className="text-[var(--text-muted)]">Strategy:</span>{" "}
              <span className="font-medium">{strategyName}</span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border w-fit ${risk.className}`}>
                {risk.icon} Risk: {risk.label}
              </span>

              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700 w-fit">
                <Bot size={12} /> Mode: {isAuto ? "Auto" : "Manual"}
              </span>

              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border w-fit ${statusConfig.className}`}>
                {statusConfig.icon} Status: {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* SETTINGS */}
        <div className="relative" ref={settingsRef}>
          <button
            className="icon-muted hover:icon-primary"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings((v) => !v);
            }}
          >
            <MoreVertical size={18} />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 z-50">
              <BotSettingsMenu
                onOpen={(type) => {
                  setShowSettings(false);
                  onOpenSettings?.(type, bot);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="bg-[var(--bg-soft)] rounded-xl px-4 py-3 text-sm">
        <span className="text-[var(--text-muted)]">Huidige status:</span>{" "}
        <span className="font-semibold">
          {loadingDecision
            ? "ANALYSING"
            : decision?.action
            ? decision.action.toUpperCase()
            : "—"}
        </span>

        {decision?.confidence && (
          <span
            className={`ml-2 px-2 py-1 text-xs font-semibold rounded-md border ${getConfidenceStyle(
              decision.confidence
            )}`}
          >
            Confidence {decision.confidence.toUpperCase()}
          </span>
        )}
      </div>

      {/* MARKET CONDITIONS */}
      <MarketConditionsPanel scores={marketScores} />

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BotDecisionCard
          bot={bot}
          decision={decision ?? null}
          order={order ?? null}
          loading={loadingDecision}
          isAuto={isAuto}
          onGenerate={onGenerate}
          onExecute={!isAuto ? onExecute : undefined}
          onSkip={!isAuto ? onSkip : undefined}
        />

        <div className="space-y-4">
          <BotPortfolioCard bot={effectivePortfolio} />
          <BotTradeTable trades={Array.isArray(trades) ? trades : []} />
        </div>
      </div>

      {/* HISTORY */}
      <div className="pt-2 border-t">
        <button
          onClick={() => setShowHistory((v) => !v)}
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
    </div>
  );
}
