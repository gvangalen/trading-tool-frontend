'use client';

import React from 'react';

export default function TechnicalDayTableForDashboard({ data = [], onRemove }) {
  // ✅ Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        ⚠️ Geen technische dagdata beschikbaar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm border border-gray-200 dark:border-gray-700 rounded">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-2">📊 Indicator</th>
            <th className="p-2 text-center">Waarde</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Advies</th>
            <th className="p-2">Uitleg</th>
            <th className="p-2 text-center">🗑️</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const {
              indicator = '–',
              waarde = '–',
              score = '–',
              advies = '–',
              uitleg = '–',
              symbol,
            } = item;

            return (
              <tr key={symbol || `row-${index}`} className="border-t dark:border-gray-700">
                <td className="p-2 font-medium">{indicator}</td>
                <td className="p-2 text-center">{waarde}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
                  {score}
                </td>
                <td className="p-2 text-center">{advies}</td>
                <td className="p-2">{uitleg}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onRemove?.(symbol || `row-${index}`)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
