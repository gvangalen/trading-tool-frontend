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
  if (value < 0.7) return "text-red-600";
  if (value < 0.95) return "text-orange-600";
  if (value <= 1.05) return "text-gray-600 dark:text-gray-300";
  if (value <= 1.25) return "text-blue-600";
  return "text-purple-600";
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
  multiplier = 1,
}) {

  const safeHealth = clamp(health);
  const safeRisk = clamp(transitionRisk);
  const safePressure = clamp(pressure);
  const safeMulti = safeMultiplier(multiplier);

  const exposureLabel = getExposureLabel(safeMulti);
  const exposureColor = getExposureColor(safeMulti);

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
        value={safeRisk}
        color="bg-orange-500"
        getLabel={getVolatilityLabel}
      />

      {/* TREND STRENGTH */}

      <Bar
        icon={<TrendingUp size={16} />}
        label="Trend strength"
        value={safePressure}
        color="bg-blue-500"
        getLabel={getTrendStrengthLabel}
      />

      {/* POSITION SIZE */}

      <div className="flex items-center gap-4 text-sm w-full pt-1">

        <span className="w-5 flex items-center justify-center">
          <Scale size={16} />
        </span>

        <span className="w-40 text-gray-600 dark:text-gray-300">
          Position size
        </span>

        <div className="flex-1" />

        <span className={`w-20 text-right font-semibold ${exposureColor}`}>
          {safeMulti.toFixed(2)}×
        </span>

        <span className="w-36 text-gray-500">
          {exposureLabel}
        </span>

      </div>

    </div>
  );
}
