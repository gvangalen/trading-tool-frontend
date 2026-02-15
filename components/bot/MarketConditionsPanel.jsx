"use client";

/* Helpers */
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

/* Compact bar */
function Bar({ icon, label, value, color }) {
  const blocks = 8;
  const filled = Math.round((value / 100) * blocks);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs">{icon}</span>

      <div className="flex gap-[3px]">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-sm ${
              i < filled ? color : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

export default function MarketConditionsInline({
  health = 50,
  transitionRisk = 50,
  pressure = 50,
  multiplier = 1,
}) {
  const exposureLabel = getExposureLabel(multiplier);
  const exposureColor = getExposureColor(multiplier);

  return (
    <div className="flex flex-wrap items-center gap-6">

      <Bar icon="🟢" label="Health" value={health} color="bg-emerald-500" />
      <Bar icon="🟠" label="Risk" value={transitionRisk} color="bg-orange-500" />
      <Bar icon="🔵" label="Pressure" value={pressure} color="bg-blue-500" />

      <div className="flex items-center gap-2 text-xs">
        <span>🟣</span>
        <span className={`font-semibold ${exposureColor}`}>
          {multiplier.toFixed(2)}×
        </span>
        <span className="text-gray-500">{exposureLabel}</span>
      </div>

    </div>
  );
}
