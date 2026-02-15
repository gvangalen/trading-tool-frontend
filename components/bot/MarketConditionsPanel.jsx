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
   Bar Component (compact cockpit style)
========================================= */

function Bar({ label, value, color }) {
  const blocks = 8;
  const filled = Math.round((value / 100) * blocks);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-medium w-40 flex items-center gap-2">
        <span>{label.icon}</span>
        {label.text}
      </div>

      <div className="flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-sm transition-all duration-300 ${
              i < filled ? color : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================
   Main Panel — cockpit widget
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
    <div
      className="
        rounded-xl
        border border-gray-200 dark:border-gray-800
        bg-gray-50 dark:bg-[#121212]
        px-4 py-3
        space-y-2
        min-w-[260px]
      "
    >
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
      <div className="flex items-center justify-between pt-2 border-t border-gray-300/60 dark:border-gray-700/60">
        <div className="text-xs font-medium flex items-center gap-2">
          <span>🟣</span>
          Exposure
        </div>

        <div className="text-right">
          <div className={`font-semibold text-sm ${exposureColor}`}>
            {multiplier.toFixed(2)}×
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            {exposureLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
