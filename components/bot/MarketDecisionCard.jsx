"use client";

import {
  Activity,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

/**
 * MarketDecisionCard
 *
 * Visualiseert:
 * - regime
 * - risk state
 * - market pressure
 * - transition risk
 *
 * Backend = single source of truth
 */

export default function MarketDecisionCard({
  decision = {},
}) {
  if (!decision) return null;

  const regime = decision.regime || "unknown";
  const riskState = decision.risk_state || "normal";
  const pressure = Number(decision.market_pressure ?? 50);
  const transitionRisk = Number(decision.transition_risk ?? 0);

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
     RENDER
  ====================================== */

  return (
    <div className="rounded-xl border bg-white p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold">
        <Activity size={16} />
        Market Intelligence
      </div>

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
        <span className={`font-semibold ${transitionColor}`}>
          {transitionLabel}
        </span>
      </div>
    </div>
  );
}
