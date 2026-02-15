"use client";

import { useEffect, useRef, useState } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotTradeTable from "@/components/bot/BotTradeTable";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";
import MarketConditionsInline from "@/components/bot/MarketConditionsInline";

import {
  Bot,
  MoreVertical,
  Clock,
  Shield,
  Scale,
  Rocket,
  TrendingUp,
} from "lucide-react";

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
  const strategyName =
    bot?.strategy?.name || bot?.strategy?.type || "—";

  /* ========= EXECUTION ========= */

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
    executionMode === "custom"
      ? "Curve sizing"
      : "Fixed amount";

  /* ========= CLICK OUTSIDE ========= */

  useEffect(() => {
    if (!showSettings) return;

    const handler = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showSettings]);

  /* ========= RISK ========= */

  const riskConfig = {
    conservative: {
      label: "Conservative",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: <Shield size={12} />,
    },
    balanced: {
      label: "Balanced",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Scale size={12} />,
    },
    aggressive: {
      label: "Aggressive",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <Rocket size={12} />,
    },
  };

  const risk =
    riskConfig[String(bot?.risk_profile || "balanced").toLowerCase()] ||
    riskConfig.balanced;

  /* ===================================================== */

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="border-b pb-5 space-y-4">

        {/* ROW 1 */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bot size={22} />
            </div>

            <div className="text-2xl font-bold tracking-tight">
              {bot?.name}
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* ACTIVE */}
            <div
              className={`flex items-center gap-2 font-bold uppercase tracking-wide text-sm
                ${isPaused ? "text-gray-400" : "text-green-600"}
              `}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full
                ${isPaused ? "bg-gray-400" : "bg-green-500 animate-pulse"}`}
              />
              {isPaused ? "Paused" : "Active"}
            </div>

            {/* SETTINGS */}
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

        {/* ROW 2 */}
        <div className="text-sm text-gray-500">
          {symbol} · {timeframe}
        </div>

        {/* ROW 3 */}
        <div>
          <span className="text-gray-500">Strategy:</span>{" "}
          <span className="font-semibold">{strategyName}</span>
        </div>

        {/* ROW 4 */}
        <div className="flex flex-wrap gap-6 text-gray-700">

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

        {/* ROW 5 */}
        <div className="flex gap-3">

          <span className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${risk.className}`}>
            {risk.label}
          </span>

          <span className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-blue-50 text-blue-700">
            {isAuto ? "Auto Mode" : "Manual"}
          </span>

        </div>

      </div>

      {/* ================= MARKET STATE ================= */}

      <div className="flex flex-col gap-2">
        <MarketConditionsInline
          health={decision?.market_health}
          transitionRisk={decision?.transition_risk}
          pressure={decision?.market_pressure}
          multiplier={exposureMultiplier}
        />
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        <BotDecisionCard
          bot={bot}
          decision={decision}
          order={order}
          loading={loadingDecision}
          isAuto={isAuto}
          onGenerate={onGenerate}
          onExecute={!isAuto ? onExecute : undefined}
          onSkip={!isAuto ? onSkip : undefined}
        />

        <div className="space-y-4">
          <BotPortfolioCard bot={portfolio} />
          <BotTradeTable trades={trades ?? []} />
        </div>

      </div>

      {/* ================= HISTORY ================= */}

      <div className="pt-2 border-t">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2"
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
