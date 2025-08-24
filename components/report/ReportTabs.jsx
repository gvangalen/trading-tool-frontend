'use client';

const REPORT_TYPES = {
  daily: '📅 Dagrapport',
  weekly: '🗓️ Weekrapport',
  monthly: '📆 Maandrapport',
  quarterly: '📊 Kwartaalrapport',
};

// 🔵 Optioneel: geef elke tab een unieke kleur
const getColor = (key, selected) => {
  if (!selected) return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
  switch (key) {
    case 'daily':
      return 'bg-blue-600 text-white border-blue-600';
    case 'weekly':
      return 'bg-green-600 text-white border-green-600';
    case 'monthly':
      return 'bg-yellow-500 text-white border-yellow-500';
    case 'quarterly':
      return 'bg-purple-600 text-white border-purple-600';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
  }
};

export default function ReportTabs({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto whitespace-nowrap">
      {Object.entries(REPORT_TYPES).map(([key, label]) => (
        <button
          key={key}
          type="button"
          title={`Bekijk het ${label.toLowerCase()}`}
          onClick={() => onChange(key)}
          className={`px-4 py-2 text-sm rounded-md font-medium border transition ${getColor(key, selected === key)}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
