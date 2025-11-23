'use client';

const REPORT_TYPES = {
  daily: '📅 Dagrapport',
  weekly: '🗓 Weekrapport',
  monthly: '📆 Maandrapport',
  quarterly: '📊 Kwartaalrapport',
};

// 🎨 Stijl presets
const tabStyles = {
  base: `
    px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)]
    border transition-all select-none
    shadow-sm hover:shadow-md
    bg-[var(--bg-soft)] text-[var(--text-dark)] border-[var(--border)]
  `,
  activeDaily: `
    bg-blue-600 text-white border-blue-600
    shadow-md hover:shadow-lg
  `,
  activeWeekly: `
    bg-green-600 text-white border-green-600
    shadow-md hover:shadow-lg
  `,
  activeMonthly: `
    bg-yellow-500 text-white border-yellow-500
    shadow-md hover:shadow-lg
  `,
  activeQuarterly: `
    bg-purple-600 text-white border-purple-600
    shadow-md hover:shadow-lg
  `,
};

// 🔵 juiste stijl bepalen
const getColor = (key, isSelected) => {
  if (!isSelected) return tabStyles.base;

  switch (key) {
    case 'daily':
      return `${tabStyles.base} ${tabStyles.activeDaily}`;
    case 'weekly':
      return `${tabStyles.base} ${tabStyles.activeWeekly}`;
    case 'monthly':
      return `${tabStyles.base} ${tabStyles.activeMonthly}`;
    case 'quarterly':
      return `${tabStyles.base} ${tabStyles.activeQuarterly}`;
    default:
      return tabStyles.base;
  }
};

export default function ReportTabs({ selected, onChange }) {
  return (
    <div
      className="
        flex flex-wrap gap-2 mb-6 pb-2
        overflow-x-auto whitespace-nowrap
        animate-fade-slide
      "
    >
      {Object.entries(REPORT_TYPES).map(([key, label]) => (
        <button
          key={key}
          type="button"
          title={`Bekijk het ${label.toLowerCase()}`}
          onClick={() => onChange(key)}
          className={getColor(key, selected === key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
