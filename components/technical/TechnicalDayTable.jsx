'use client';

import { useEffect } from 'react';

export default function TechnicalDayTable({ data = [], onRemove, showDebug = false }) {
  useEffect(() => {
    console.log('📊 [TechnicalDayTable] received data:', data);
  }, [data]);

  // 🧠 Fallback voor geen data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ No daily technical data available.
        </td>
      </tr>
    );
  }

  // ✅ Kleur bepalen op basis van score
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <>
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
                onClick={() => {
                  console.log('🗑️ Removing:', symbol || `item-${index}`);
                  if (onRemove) onRemove(symbol || `item-${index}`);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}

      {/* 🧪 Optionele debug view */}
      {showDebug && (
        <tr>
          <td colSpan={6}>
            <pre className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-64 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
