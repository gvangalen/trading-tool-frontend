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
  TrendingUp,
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 3.3
 * Clean cockpit header + live status
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

  /* ================= EXECUTION INFO ================= */

  const executionMode =
    bot?.strategy?.execution_mode ||
    bot?.execution_mode ||
    "fixed";

  const curveName =
    bot?.strategy?.decision_curve_name ||
    bot?.strategy?.curve_name ||
    null;

  const exposureMultiplier =
    decision?.exposure_multiplier ??
    bot?.strategy?.exposure_multiplier ??
    1;

  const executionLabel =
    executionMode === "custom" ? "Curve sizing" : "Fixed amount";

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

  /* ================= RISK ================= */

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

  /* ================= MARKET SCORES ================= */

  const marketScores = {
    health: decision?.market_health ?? 50,
    transitionRisk: decision?.transition_risk ?? 50,
    pressure: decision?.market_pressure ?? 50,
    multiplier: exposureMultiplier,
  };

  /* ================= RENDER ================= */

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6 relative">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

        {/* LEFT SIDE */}
        <div className="flex items-start gap-3">

          <div className="icon-primary mt-1">
            <Brain size={18} />
          </div>

          <div className="space-y-2">

            {/* NAME + LIVE STATUS */}
            <div className="flex items-center gap-3">
              <div className="font-semibold text-lg leading-none">
                {bot?.name ?? "Bot"}
              </div>

              <div className={`flex items-center gap-1 text-xs font-semibold uppercase
                ${isPaused ? "text-gray-500" : "text-green-600"}
              `}>
                <span className={`w-2 h-2 rounded-full
                  ${isPaused ? "bg-gray-400" : "bg-green-500 animate-pulse"}
                `}/>
                {isPaused ? "Paused" : "Active"}
              </div>
            </div>

            {/* SYMBOL */}
            <div className="text-xs text-[var(--text-muted)]">
              {symbol} · {timeframe}
            </div>

            {/* STRATEGY */}
            <div className="text-xs">
              <span className="text-[var(--text-muted)]">Strategy:</span>{" "}
              <span className="font-medium">{strategyName}</span>
            </div>

            {/* EXECUTION CONTEXT */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-1">

              <div className="flex items-center gap-1">
                <TrendingUp size={12} />
                <span className="font-medium">{executionLabel}</span>
                {executionMode === "custom" && curveName && (
                  <span className="text-gray-500">· {curveName}</span>
                )}
              </div>

              <div className="font-medium">
                Exposure:
                <span className="ml-1 text-indigo-600 font-semibold">
                  {exposureMultiplier.toFixed(2)}×
                </span>
              </div>

            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2 pt-1">

              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${risk.className}`}>
                {risk.icon} {risk.label}
              </span>

              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700">
                <Bot size={12} /> {isAuto ? "Auto" : "Manual"}
              </span>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-start gap-3 justify-between lg:justify-end w-full lg:w-auto">

          <MarketConditionsPanel {...marketScores} />

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
      </div>

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
          <BotPortfolioCard bot={portfolio} />
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
