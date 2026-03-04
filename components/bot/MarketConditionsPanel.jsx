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
   LABEL MAPPINGS
===================================================== */

const getHealthLabel = (v) => {
  if (v < 30) return "Weak";
  if (v < 50) return "Fragile";
  if (v < 70) return "Good";
  if (v < 85) return "Strong";
  return "Very strong";
};

const getRiskLabel = (v) => {
  if (v < 25) return "Low";
  if (v < 50) return "Normal";
  if (v < 70) return "Elevated";
  if (v < 85) return "High";
  return "Extreme";
};

const getPressureLabel = (v) => {
  if (v < 30) return "Low";
  if (v < 50) return "Neutral";
  if (v < 70) return "Moderate";
  if (v < 85) return "High";
  return "Extreme";
};

const getExposureLabel = (value) => {
  if (value < 0.7) return "DEFENSIVE";
  if (value < 0.95) return "REDUCED";
  if (value <= 1.05) return "NORMAL";
  if (value <= 1.25) return "ELEVATED";
  return "AGGRESSIVE";
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
      <span className="w-16 text-gray-600 dark:text-gray-300">
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

      {/* status label */}
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
    <div className="flex flex-wrap items-center gap-6">

      <Bar
        icon="🟢"
        label="Health"
        value={safeHealth}
        color="bg-emerald-500"
        getLabel={getHealthLabel}
      />

      <Bar
        icon="🟠"
        label="Risk"
        value={safeRisk}
        color="bg-orange-500"
        getLabel={getRiskLabel}
      />

      <Bar
        icon="🔵"
        label="Pressure"
        value={safePressure}
        color="bg-blue-500"
        getLabel={getPressureLabel}
      />

      {/* Exposure multiplier */}

      <div className="flex items-center gap-2 text-xs">

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
