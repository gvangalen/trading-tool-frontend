"use client";

import {
  Activity,
  Thermometer,
} from "lucide-react";

import MarketConditionsPanel from "@/components/bot/MarketConditionsPanel";

export default function MarketDecisionCard({ decision = {} }) {
  if (!decision) return null;

  /* ======================================
   ENGINE METRICS (FIXED CORRECT)
====================================== */

  const scores = decision?.scores_json || {};
  const metrics = decision?.metrics || {};

  // 🔥 MARKET PRESSURE
  const pressureRaw =
    scores?.market_pressure ??
    metrics?.market_pressure ??
    50;

  const pressure = Number.isFinite(Number(pressureRaw))
    ? Number(pressureRaw)
    : 50;

  // 🔥 TRANSITION RISK
  const transitionRiskRaw =
    scores?.transition_risk ??
    metrics?.transition_risk ??
    50;

  const transitionRisk = Number.isFinite(Number(transitionRiskRaw))
    ? Number(transitionRiskRaw)
    : 50;

  // 🔥 SETUP QUALITY (HEALTH)
  const healthRaw =
    scores?.setup_quality ??
    metrics?.setup_quality ??
    50;

  const health = Number.isFinite(Number(healthRaw))
    ? Number(healthRaw)
    : 50;

  // 🔥 VOLATILITY (FIX)
  const volatilityRaw =
    scores?.volatility ??
    metrics?.volatility ??
    50;

  const volatility = Number.isFinite(Number(volatilityRaw))
    ? Number(volatilityRaw)
    : 50;

  // 🔥 TREND STRENGTH (FIX)
  const trendStrengthRaw =
    scores?.trend_strength ??
    metrics?.trend_strength ??
    50;

  const trendStrength = Number.isFinite(Number(trendStrengthRaw))
    ? Number(trendStrengthRaw)
    : 50;

  // 🔥 POSITION SIZE
  const positionSizeRaw =
    decision?.position_size ??
    scores?.position_size ??
    metrics?.position_size ??
    0.5;

  const positionSize = Number.isFinite(Number(positionSizeRaw))
    ? Number(positionSizeRaw)
    : 0.5;

  /* ======================================
     MARKET STRUCTURE
  ====================================== */

  const phase = decision?.cycle || "expansion";
  const temperature = decision?.temperature || "warm";

  /* ======================================
     TRENDS
  ====================================== */

  const trendShort =
    decision?.trend?.short || "trading range";

  const trendMid =
    decision?.trend?.mid || "trading range";

  const trendLong =
    decision?.trend?.long || "trading range";

  const explanation = decision?.explanation || null;

  /* ======================================
     TREND LABELS
  ====================================== */

  const formatTrend = (trend) => {
    const t = String(trend).toLowerCase();

    if (t === "bullish") return "Bullish";
    if (t === "bearish") return "Bearish";

    if (
      t === "range" ||
      t === "sideways" ||
      t === "trading range"
    ) {
      return "Trading range";
    }

    return "Trading range";
  };

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
    <div className="space-y-5">

      <div className="flex items-center gap-2 font-semibold text-base">
        <Activity size={16} />
        Market Intelligence — Global Analysis
      </div>

      {/* MARKET CYCLE */}

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

      {/* TRENDS */}

      <div className="space-y-1 text-sm">

        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">Short term trend</span>
          <span className="font-semibold">{formatTrend(trendShort)}</span>
        </div>

        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">Mid term trend</span>
          <span className="font-semibold">{formatTrend(trendMid)}</span>
        </div>

        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">Long term trend</span>
          <span className="font-semibold">{formatTrend(trendLong)}</span>
        </div>

      </div>

      {/* AI explanation */}

      {explanation && (
        <div className="text-xs text-gray-600 border-t pt-3">
          {explanation}
        </div>
      )}

      {/* 🔥 BOT RISK ENGINE */}

      <div className="border-t pt-4">

        <MarketConditionsPanel
          health={health}
          transitionRisk={transitionRisk}
          pressure={pressure}
          volatility={volatility}            // ✅ FIX
          trendStrength={trendStrength}      // ✅ FIX
          multiplier={positionSize}
        />

      </div>

    </div>
  );
}
