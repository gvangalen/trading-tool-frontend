"use client";

import {
  Activity,
  Thermometer,
} from "lucide-react";

import MarketConditionsPanel from "@/components/bot/MarketConditionsPanel";

export default function MarketDecisionCard({ data }) {
  if (!data) return null;

  /* ======================================
     API DATA (DE ENIGE SOURCE)
  ====================================== */

  const metrics = data?.metrics || {};
  const trend = data?.trend || {};

  const pressure = Number(metrics?.market_pressure ?? 50);
  const transitionRisk = Number(metrics?.transition_risk ?? 50);
  const health = Number(metrics?.setup_quality ?? 50);
  const volatility = Number(metrics?.volatility ?? 50);
  const trendStrength = Number(metrics?.trend_strength ?? 50);

  // position size bestaat niet in API → default
  const positionSize = 0.5;

  /* ======================================
     MARKET STRUCTURE
  ====================================== */

  const phase = data?.cycle || "expansion";
  const temperature = data?.temperature || "warm";

  /* ======================================
     TRENDS
  ====================================== */

  const trendShort = trend?.short || "trading range";
  const trendMid = trend?.mid || "trading range";
  const trendLong = trend?.long || "trading range";

  const formatTrend = (t) => {
    const v = String(t).toLowerCase();

    if (v === "bullish") return "Bullish";
    if (v === "bearish") return "Bearish";

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
     DEBUG (BELANGRIJK)
  ====================================== */

  console.log("MARKET API DATA", data);

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
          <span className="text-gray-500">Temperature</span>
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

      {/* CONDITIONS */}

      <div className="border-t pt-4">

        <MarketConditionsPanel
          health={health}
          transitionRisk={transitionRisk}
          pressure={pressure}
          volatility={volatility}
          trendStrength={trendStrength}
          multiplier={positionSize}
        />

      </div>

    </div>
  );
}
