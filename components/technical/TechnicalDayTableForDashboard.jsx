'use client';

import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalDayTableForDashboard({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Geen technische data beschikbaar.
      </div>
    );
  }

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
            <tr key={item.symbol || index} className="border-t">
              <td className="p-2 font-medium">{item.indicator}</td>
              <td className="p-2 text-center">{item.waarde ?? '–'}</td>
              <td
                className={`p-2 text-center font-bold ${
                  item.score >= 2
                    ? 'text-green-600'
                    : item.score <= -2
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {item.score ?? '–'}
              </td>
              <td className="p-2 text-center">{item.advies ?? '–'}</td>
              <td className="p-2">{item.uitleg ?? '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
