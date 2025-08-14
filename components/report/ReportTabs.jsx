'use client';

const REPORT_TYPES = {
  daily: '📅 Dagrapport',
  weekly: '🗓️ Weekrapport',
  monthly: '📆 Maandrapport',
  quarterly: '📊 Kwartaalrapport',
};

export default function ReportTabs({ selected, onChange }) {
  const tabStyle = (key) =>
    `px-4 py-2 text-sm rounded-md font-medium border ${
      selected === key
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(REPORT_TYPES).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={tabStyle(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
