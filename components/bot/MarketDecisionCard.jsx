"use client";

import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Thermometer,
} from "lucide-react";

import MarketConditionsPanel from "@/components/bot/MarketConditionsPanel";

/**
 * MarketDecisionCard
 *
 * Visualiseert:
 * - Market cycle
 * - Temperature
 * - Market trends
 * - Transition risk
 * - Bot risk engine metrics (via MarketConditionsPanel)
 */

export default function MarketDecisionCard({ decision = {} }) {
  if (!decision) return null;

  /* ======================================
     ENGINE METRICS
  ====================================== */

  const pressure = Number(decision.market_pressure ?? 50);
  const transitionRisk = Number(decision.transition_risk ?? 0);

  const health = Number(decision.health ?? 50);
  const exposureMultiplier = Number(decision.exposure_multiplier ?? 1);

  /* ======================================
     MARKET STRUCTURE
  ====================================== */

  const phase = decision.phase || "expansion";
  const temperature = decision.temperature || "warm";

  /* ======================================
     TRENDS
  ====================================== */

  const trendShort = decision.trend_short || "trading range";
  const trendMid = decision.trend_mid || "trading range";
  const trendLong = decision.trend_long || "trading range";

  const explanation = decision.explanation || null;

  /* ======================================
     TREND LABELS
  ====================================== */

  const formatTrend = (trend) => {
    const t = String(trend).toLowerCase();

    if (t === "bullish") return "Bullish";
    if (t === "bearish") return "Bearish";
    if (t === "range" || t === "sideways" || t === "trading range")
      return "Trading range";

    return "Trading range";
  };

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
     MARKET CYCLE
  ====================================== */

  const phases = [
    "Accumulation",
    "Expansion",
    "Distribution",
    "Correction",
  ];

  const phaseIndex =
    {
      accumulation: 0,
      expansion: 1,
      distribution: 2,
      correction: 3,
    }[phase?.toLowerCase()] ?? 1;

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
          MARKET CYCLE
      ========================== */}

      <div className="space-y-2">

        <div className="text-xs text-gray-500">
          Market Cycle
        </div>

        <div className="flex items-center gap-2 text-sm">

          {phases.map((p, i) => (
            <div key={p} className="flex items-center gap-1">

              <span
                className={
                  i === phaseIndex
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400"
                }
              >
                {p}
              </span>

              {i === phaseIndex && (
                <span className="text-blue-600">▲</span>
              )}

              {i < phases.length - 1 && (
                <span className="text-gray-400">→</span>
              )}

            </div>
          ))}

        </div>

        {/* Temperature */}

        <div className="flex items-center gap-2 text-sm">

          <Thermometer size={14} className="text-gray-500" />

          <span className="text-gray-500">
            Temperature
          </span>

          <span
            className={`font-semibold capitalize ${temperatureColor}`}
          >
            {temperature}
          </span>

        </div>

      </div>

      {/* =========================
          MARKET TRENDS
      ========================== */}

      <div className="space-y-1 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Short term trend
          </span>
          <span className="font-semibold">
            {formatTrend(trendShort)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Mid term trend
          </span>
          <span className="font-semibold">
            {formatTrend(trendMid)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Long term trend
          </span>
          <span className="font-semibold">
            {formatTrend(trendLong)}
          </span>
        </div>

      </div>

      {/* AI explanation */}

      {explanation && (
        <div className="text-xs text-gray-600 border-t pt-3">
          {explanation}
        </div>
      )}

      {/* =========================
          MARKET PRESSURE
      ========================== */}

      <div className="border-t pt-4 space-y-3">

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

        {/* Bot risk engine */}

        <MarketConditionsPanel
          health={health}
          transitionRisk={transitionRisk}
          pressure={pressure}
          multiplier={exposureMultiplier}
        />

      </div>

    </div>
  );
}
