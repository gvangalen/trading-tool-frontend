"use client";

import {
  Activity,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  Brain,
} from "lucide-react";

import MarketConditionsInline from "@/components/bot/MarketConditionsInline";

/**
 * MarketDecisionCard
 *
 * Visualiseert:
 * - Market phase
 * - Market temperature
 * - Trends
 * - Bot mode
 * - AI explanation
 *
 * Engine metrics (regime / pressure / risk)
 * blijven zichtbaar onderaan.
 *
 * Backend = single source of truth
 */

export default function MarketDecisionCard({
  decision = {},
}) {
  if (!decision) return null;

  /* ======================================
     ENGINE METRICS
  ====================================== */

  const regime = decision.regime || "unknown";
  const riskState = decision.risk_state || "normal";
  const pressure = Number(decision.market_pressure ?? 50);
  const transitionRisk = Number(decision.transition_risk ?? 0);

  const health = Number(decision.health ?? 50);
  const exposureMultiplier = Number(decision.exposure_multiplier ?? 1);

  /* ======================================
     INTERPRETED STATE
  ====================================== */

  const phase = decision.phase || "consolidation";
  const temperature = decision.temperature || "warm";

  const trendShort = decision.trend_short || "neutral";
  const trendMid = decision.trend_mid || "neutral";
  const trendLong = decision.trend_long || "neutral";

  const botMode = decision.bot_mode || "normal";
  const explanation = decision.explanation || null;

  /* ======================================
     REGIME LABEL
  ====================================== */

  const regimeLabel =
    regime === "risk_on"
      ? "Risk-On"
      : regime === "risk_off"
      ? "Risk-Off"
      : regime === "transition"
      ? "Transition"
      : "Neutral";

  const regimeColor =
    regime === "risk_on"
      ? "text-emerald-600"
      : regime === "risk_off"
      ? "text-red-600"
      : regime === "transition"
      ? "text-orange-600"
      : "text-gray-500";

  /* ======================================
     RISK STATE
  ====================================== */

  const riskLabel =
    riskState === "low"
      ? "Low risk"
      : riskState === "elevated"
      ? "Elevated risk"
      : riskState === "high"
      ? "High stress"
      : "Normal";

  const riskColor =
    riskState === "low"
      ? "text-emerald-600"
      : riskState === "elevated"
      ? "text-orange-600"
      : riskState === "high"
      ? "text-red-600"
      : "text-gray-600";

  /* ======================================
     PRESSURE BAR
  ====================================== */

  const pressureBlocks = 8;
  const filledPressure = Math.round(
    (Math.min(pressure, 100) / 100) * pressureBlocks
  );

  const pressureColor =
    pressure > 70
      ? "bg-red-500"
      : pressure > 50
      ? "bg-orange-500"
      : pressure > 30
      ? "bg-blue-500"
      : "bg-emerald-500";

  /* ======================================
     TRANSITION RISK
  ====================================== */

  const transitionLabel =
    transitionRisk > 70
      ? "High shift risk"
      : transitionRisk > 40
      ? "Moderate shift risk"
      : "Stable regime";

  const transitionColor =
    transitionRisk > 70
      ? "text-red-600"
      : transitionRisk > 40
      ? "text-orange-600"
      : "text-emerald-600";

  /* ======================================
     MARKET PHASE VISUAL
  ====================================== */

  const phases = [
    "Accumulation",
    "Expansion",
    "Distribution",
    "Correction",
  ];

  const phaseIndex = {
    accumulation: 0,
    expansion: 1,
    distribution: 2,
    correction: 3,
  }[phase?.toLowerCase()] ?? 1;

  /* ======================================
     TEMPERATURE COLOR
  ====================================== */

  const temperatureColor =
    temperature === "cold"
      ? "text-blue-500"
      : temperature === "warm"
      ? "text-emerald-500"
      : temperature === "hot"
      ? "text-orange-500"
      : "text-red-500";

  /* ======================================
     RENDER
  ====================================== */

  return (
    <div className="rounded-xl border bg-white p-5 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold">
        <Activity size={16} />
        Market Intelligence
      </div>

      {/* =========================
          MARKET PHASE
      ========================== */}

      <div className="space-y-2">
        <div className="text-xs text-gray-500">
          Market Phase
        </div>

        <div className="font-semibold capitalize">
          {phase}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          {phases.map((p, i) => (
            <div
              key={p}
              className={`flex items-center gap-1 ${
                i === phaseIndex
                  ? "text-blue-600 font-semibold"
                  : ""
              }`}
            >
              {p}
              {i < phases.length - 1 && "→"}
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          MARKET TEMPERATURE
      ========================== */}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-2">
          <Thermometer size={14} />
          Market temperature
        </span>

        <span
          className={`font-semibold capitalize ${temperatureColor}`}
        >
          {temperature}
        </span>
      </div>

      {/* =========================
          TRENDS
      ========================== */}

      <div className="space-y-1 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Short term trend
          </span>
          <span className="font-semibold capitalize">
            {trendShort}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Mid term trend
          </span>
          <span className="font-semibold capitalize">
            {trendMid}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Long term trend
          </span>
          <span className="font-semibold capitalize">
            {trendLong}
          </span>
        </div>

      </div>

      {/* =========================
          BOT MODE
      ========================== */}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-2">
          <Brain size={14} />
          Bot mode
        </span>

        <span className="font-semibold capitalize">
          {botMode}
        </span>
      </div>

      {/* =========================
          AI EXPLANATION
      ========================== */}

      {explanation && (
        <div className="text-xs text-gray-600 border-t pt-3">
          {explanation}
        </div>
      )}

      {/* =========================
          ENGINE METRICS
      ========================== */}

      <div className="border-t pt-4 space-y-3">

        {/* Regime */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <TrendingUp size={14} />
            Regime
          </span>
          <span className={`font-semibold ${regimeColor}`}>
            {regimeLabel}
          </span>
        </div>

        {/* Risk state */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <ShieldAlert size={14} />
            Risk state
          </span>
          <span className={`font-semibold ${riskColor}`}>
            {riskLabel}
          </span>
        </div>

        {/* Market pressure */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Market pressure</span>
            <span>{pressure}</span>
          </div>

          <div className="flex gap-[3px]">
            {[...Array(pressureBlocks)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-4 rounded-sm ${
                  i < filledPressure
                    ? pressureColor
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Transition risk */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <AlertTriangle size={14} />
            Transition risk
          </span>
          <span
            className={`font-semibold ${transitionColor}`}
          >
            {transitionLabel}
          </span>
        </div>

        {/* Inline Engine Metrics */}
        <MarketConditionsInline
          health={health}
          transitionRisk={transitionRisk}
          pressure={pressure}
          multiplier={exposureMultiplier}
        />

      </div>

    </div>
  );
}
