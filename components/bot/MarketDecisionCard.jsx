"use client";

import {
  Activity,
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
 * - AI explanation
 *
 * Risk engine metrics komen uit Bot Brain API
 */

export default function MarketDecisionCard({ decision = {} }) {
  if (!decision) return null;

  /* ======================================
   ENGINE METRICS (Bot Brain API)
  ====================================== */

  const pressure =
    Number(decision?.metrics?.market_pressure ?? 0);

  const transitionRisk =
    Number(decision?.metrics?.transition_risk ?? 0);

  const health =
    Number(decision?.metrics?.setup_quality ?? 50);

  const exposureMultiplier =
    Number(decision?.metrics?.position_size ?? 1);

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

      {/* HEADER */}

      <div className="flex items-center gap-2 font-semibold text-base">
        <Activity size={16} />
        Market Intelligence — Global Analysis
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

        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">
            Short term trend
          </span>
          <span className="font-semibold text-left">
            {formatTrend(trendShort)}
          </span>
        </div>
      
        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">
            Mid term trend
          </span>
          <span className="font-semibold text-left">
            {formatTrend(trendMid)}
          </span>
        </div>
      
        <div className="grid grid-cols-[1fr_120px] items-center">
          <span className="text-gray-500">
            Long term trend
          </span>
          <span className="font-semibold text-left">
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
          BOT RISK ENGINE
      ========================== */}

      <div className="border-t pt-4">

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
