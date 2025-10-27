'use client';

import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalDayTableForDashboard({ data = [] }) {
  // 🧠 Geen data fallback
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Geen technische data beschikbaar.
      </div>
    );
  }

  // 🎨 Kleur voor score
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🧾 Tabel renderen
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-2">📊 Indicator</th>
            <th className="p-2 text-center">Waarde</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Advies</th>
            <th className="p-2">Uitleg</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.symbol || `${item.indicator}-${index}`} className="border-t dark:border-gray-700">
              <td className="p-2 font-medium">{item.indicator ?? '–'}</td>
              <td className="p-2 text-center">{item.value ?? '–'}</td>
              <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
                {item.score ?? '–'}
              </td>
              <td className="p-2 text-center">{item.advies ?? '–'}</td>
              <td className="p-2">{item.uitleg ?? item.explanation ?? '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
