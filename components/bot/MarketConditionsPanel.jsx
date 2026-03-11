"use client";

/* =====================================================
   🎯 HELPERS
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
   TRADER FRIENDLY LABELS
===================================================== */

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
   📊 BAR COMPONENT
===================================================== */

function Bar({ icon, label, value, color, getLabel }) {
  const blocks = 10;
  const safeValue = clamp(value);
  const filled = Math.round(safeValue / 10);
  const status = getLabel(safeValue);

  return (
    <div className="flex items-center gap-3 text-xs">

      {/* icon */}
      <span>{icon}</span>

      {/* label */}
      <span className="w-28 text-gray-600 dark:text-gray-300">
        {label}
      </span>

      {/* blocks */}
      <div className="flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-sm ${
              i < filled
                ? color
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* score */}
      <span className="w-8 text-right font-medium">
        {safeValue}
      </span>

      {/* status */}
      <span className="text-gray-500">
        {status}
      </span>
    </div>
  );
}

/* =====================================================
   📈 MAIN COMPONENT
===================================================== */

export default function MarketConditionsInline({
  health = 50,
  transitionRisk = 50,
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
    <div className="flex flex-col gap-3">

      <Bar
        icon="🟢"
        label="Setup quality"
        value={safeHealth}
        color="bg-emerald-500"
        getLabel={getSetupQualityLabel}
      />

      <Bar
        icon="🟠"
        label="Market volatility"
        value={safeRisk}
        color="bg-orange-500"
        getLabel={getVolatilityLabel}
      />

      <Bar
        icon="🔵"
        label="Trend strength"
        value={safePressure}
        color="bg-blue-500"
        getLabel={getTrendStrengthLabel}
      />

      {/* Position size */}

      <div className="flex items-center gap-2 text-xs pt-1">

        <span>🟣</span>

        <span className={`font-semibold ${exposureColor}`}>
          {safeMulti.toFixed(2)}×
        </span>

        <span className="text-gray-500">
          {exposureLabel}
        </span>

      </div>

    </div>
  );
}
