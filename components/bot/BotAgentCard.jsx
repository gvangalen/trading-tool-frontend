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
 * BotAgentCard — TradeLayer 3.4
 * ✔ Full-width clean header
 * ✔ Live status next to name
 * ✔ Market state below header (NOT inside header)
 * ✔ Clean cockpit hierarchy
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

  /* ========= EXECUTION CONTEXT ========= */

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

  /* ========= CLICK OUTSIDE ========= */

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

  /* ========= RISK ========= */

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

  /* ========= MARKET STATE ========= */

  const marketScores = {
    health: decision?.market_health ?? 50,
    transitionRisk: decision?.transition_risk ?? 50,
    pressure: decision?.market_pressure ?? 50,
    multiplier: exposureMultiplier,
  };

  /* ========= RENDER ========= */

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-5 relative">

{/* ================= HEADER ================= */}
<div className="w-full border-b pb-5 space-y-4">

  {/* ROW 1 — NAME + STATUS + SETTINGS */}
  <div className="flex items-start justify-between w-full">

    {/* LEFT: BOT ICON + NAME */}
    <div className="flex items-center gap-3">

      {/* BOT ICON */}
      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Bot size={20} />
      </div>

      <div className="text-2xl font-bold tracking-tight">
        {bot?.name}
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">

      {/* ACTIVE STATUS */}
      <div className={`flex items-center gap-2 font-bold text-sm uppercase tracking-wide
        ${isPaused ? "text-gray-400" : "text-green-600"}
      `}>
        <span className={`w-2.5 h-2.5 rounded-full
          ${isPaused ? "bg-gray-400" : "bg-green-500 animate-pulse"}
        `}/>
        {isPaused ? "Paused" : "Active"}
      </div>

      {/* SETTINGS MENU */}
      <div className="relative" ref={settingsRef}>
        <button
          className="text-gray-400 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings((v) => !v);
          }}
        >
          <MoreVertical size={20} />
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

  {/* ROW 2 — SYMBOL */}
  <div className="text-sm text-gray-500">
    {symbol} · {timeframe}
  </div>

  {/* ROW 3 — STRATEGY */}
  <div className="text-base">
    <span className="text-gray-500">Strategy:</span>{" "}
    <span className="font-semibold">{strategyName}</span>
  </div>

  {/* ROW 4 — EXECUTION */}
  <div className="flex flex-wrap gap-6 text-base text-gray-700">

    <div className="flex items-center gap-2">
      <TrendingUp size={16} />
      <span className="font-semibold">{executionLabel}</span>
      {curveName && (
        <span className="text-gray-500">· {curveName}</span>
      )}
    </div>

    <div>
      Exposure:
      <span className="ml-2 font-bold text-indigo-600">
        {exposureMultiplier.toFixed(2)}×
      </span>
    </div>

  </div>

  {/* ROW 5 — BADGES */}
  <div className="flex gap-3 pt-1">

    <span className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${risk.className}`}>
      {risk.label}
    </span>

    <span className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-blue-50 text-blue-700">
      {isAuto ? "Auto Mode" : "Manual"}
    </span>

  </div>

</div>
      
      {/* =================================================
         MARKET STATE (UNDER HEADER)
      ================================================= */}
      <MarketConditionsPanel {...marketScores} />

      {/* =================================================
         MAIN GRID
      ================================================= */}
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
