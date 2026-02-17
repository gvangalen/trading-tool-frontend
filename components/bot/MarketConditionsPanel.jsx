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

function Bar({ icon, label, value, color }) {
  const blocks = 8;
  const safeValue = clamp(value);
  const filled = Math.round((safeValue / 100) * blocks);

  return (
    <div className="flex items-center gap-3">

      <span className="text-xs">{icon}</span>

      <div className="flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-sm transition-all duration-300 ${
              i < filled
                ? `${color} opacity-${Math.min(100, 40 + filled * 8)}`
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      <span className="text-[11px] text-gray-500">{label}</span>
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
      />

      <Bar
        icon="🟠"
        label="Risk"
        value={safeRisk}
        color="bg-orange-500"
      />

      <Bar
        icon="🔵"
        label="Pressure"
        value={safePressure}
        color="bg-blue-500"
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
