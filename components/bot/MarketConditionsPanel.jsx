"use client";

/* =========================================
   Helpers
========================================= */

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
  if (value <= 1.05) return "text-gray-700 dark:text-gray-300";
  if (value <= 1.25) return "text-blue-600";
  return "text-purple-600";
};

/* =========================================
   Bar Component
========================================= */

function Bar({ label, value, color }) {
  const blocks = 8;
  const filled = Math.round((value / 100) * blocks);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm font-medium w-44 flex items-center gap-2">
        <span>{label.icon}</span>
        {label.text}
      </div>

      <div className="flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-4 rounded-sm transition-all duration-300 ${
              i < filled ? color : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================
   Main Panel
========================================= */

export default function MarketConditionsPanel({
  health = 50,
  transitionRisk = 50,
  pressure = 50,
  multiplier = 1,
}) {
  const exposureLabel = getExposureLabel(multiplier);
  const exposureColor = getExposureColor(multiplier);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-[#0f0f0f] space-y-3">

      <Bar
        label={{ icon: "🟢", text: "Market Health" }}
        value={health}
        color="bg-emerald-500"
      />

      <Bar
        label={{ icon: "🟠", text: "Transition Risk" }}
        value={transitionRisk}
        color="bg-orange-500"
      />

      <Bar
        label={{ icon: "🔵", text: "Market Pressure" }}
        value={pressure}
        color="bg-blue-500"
      />

      {/* Exposure */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
        <div className="text-sm font-medium flex items-center gap-2">
          <span>🟣</span>
          Exposure
        </div>

        <div className="text-right">
          <div className={`font-semibold text-sm ${exposureColor}`}>
            {multiplier.toFixed(2)}×
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {exposureLabel}
          </div>
        </div>
      </div>

    </div>
  );
}
