"use client";

import {
  BarChart3,
  AlertTriangle,
  Target,
  Zap,
  TrendingUp,
  Scale
} from "lucide-react";

/* =====================================================
   HELPERS
===================================================== */

const clamp = (v, min = 0, max = 100) => {
  const n = Number(v);
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
};

const safeMultiplier = (v) => {
  const n = Number(v);
  if (isNaN(n) || n <= 0) return 1;
  return n;
};

/* =====================================================
   LABELS
===================================================== */

const getPressureLabel = (v) => {
  if (v < 30) return "Calm market";
  if (v < 50) return "Neutral pressure";
  if (v < 70) return "Moderate pressure";
  if (v < 85) return "High pressure";
  return "Extreme pressure";
};

const getTransitionRiskLabel = (v) => {
  if (v < 30) return "Stable regime";
  if (v < 50) return "Minor shifts possible";
  if (v < 70) return "Regime pressure building";
  if (v < 85) return "High transition risk";
  return "Regime change risk";
};

const getSetupQualityLabel = (v) => {
  if (v < 30) return "Weak setups";
  if (v < 50) return "Mixed setups";
  if (v < 70) return "Decent setups";
  if (v < 85) return "High quality";
  return "Very strong setups";
};

const getVolatilityLabel = (v) => {
  if (v < 25) return "Very calm";
  if (v < 50) return "Normal";
  if (v < 70) return "Volatile";
  if (v < 85) return "High volatility";
  return "Extreme volatility";
};

const getTrendStrengthLabel = (v) => {
  if (v < 30) return "Weak trend";
  if (v < 50) return "Sideways";
  if (v < 70) return "Trending";
  if (v < 85) return "Strong trend";
  return "Very strong trend";
};

const getExposureLabel = (value) => {
  if (value < 0.7) return "Defensive";
  if (value < 0.95) return "Reduced size";
  if (value <= 1.05) return "Normal size";
  if (value <= 1.25) return "Increased size";
  return "Aggressive size";
};

const getExposureColor = (value) => {
  if (value < 0.7) return "bg-red-500";
  if (value < 0.95) return "bg-orange-500";
  if (value <= 1.05) return "bg-gray-500";
  if (value <= 1.25) return "bg-blue-500";
  return "bg-purple-500";
};

/* =====================================================
   BAR COMPONENT
===================================================== */

function Bar({ icon, label, value, color, getLabel }) {

  const blocks = 10;
  const safeValue = clamp(value);
  const filled = Math.round(safeValue / 10);
  const status = getLabel(safeValue);

  return (
    <div className="flex items-center gap-4 text-sm w-full">

      {/* icon */}
      <span className="w-5 flex items-center justify-center">
        {icon}
      </span>

      {/* label */}
      <span className="w-40 text-gray-600 dark:text-gray-300">
        {label}
      </span>

      {/* bar */}
      <div className="flex-1 flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-sm ${
              i < filled
                ? color
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* score */}
      <span className="w-20 text-right font-medium">
        {safeValue} / 100
      </span>

      {/* status */}
      <span className="w-36 text-gray-500">
        {status}
      </span>

    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function MarketConditionsInline({
  health = 50,
  transitionRisk = 20,
  pressure = 50,
  volatility = 50,
  trendStrength = 50,
  multiplier = 1,
}) {

  const safeHealth = clamp(health);
  const safeRisk = clamp(transitionRisk);
  const safePressure = clamp(pressure);
  const safeVolatility = clamp(volatility);
  const safeTrend = clamp(trendStrength);
  const safeMulti = safeMultiplier(multiplier);

  const exposureLabel = getExposureLabel(safeMulti);
  const exposureColor = getExposureColor(safeMulti);

  /* multiplier → score schaal */
  const exposureScore = clamp(safeMulti * 100);

  return (

    <div className="flex flex-col gap-3 w-full">

      {/* MARKET PRESSURE */}

      <Bar
        icon={<BarChart3 size={16} />}
        label="Market pressure"
        value={safePressure}
        color="bg-blue-500"
        getLabel={getPressureLabel}
      />

      {/* TRANSITION RISK */}

      <Bar
        icon={<AlertTriangle size={16} />}
        label="Transition risk"
        value={safeRisk}
        color="bg-orange-500"
        getLabel={getTransitionRiskLabel}
      />

      {/* SETUP QUALITY */}

      <Bar
        icon={<Target size={16} />}
        label="Setup quality"
        value={safeHealth}
        color="bg-emerald-500"
        getLabel={getSetupQualityLabel}
      />

      {/* MARKET VOLATILITY */}

      <Bar
        icon={<Zap size={16} />}
        label="Market volatility"
        value={safeVolatility}
        color="bg-purple-500"
        getLabel={getVolatilityLabel}
      />

      {/* TREND STRENGTH */}

      <Bar
        icon={<TrendingUp size={16} />}
        label="Trend strength"
        value={safeTrend}
        color="bg-indigo-500"
        getLabel={getTrendStrengthLabel}
      />

      {/* POSITION SIZE (UPDATED) */}

      <Bar
        icon={<Scale size={16} />}
        label="Position size"
        value={exposureScore}
        color={exposureColor}
        getLabel={() => exposureLabel}
      />

    </div>
  );
}
