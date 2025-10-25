'use client';

import { useEffect } from 'react';

export default function TechnicalDayTable({
  data = [],
  onRemove,
  showDebug = false,
  overallScore = null,
  overallAdvies = 'Neutral',
}) {
  useEffect(() => {
    console.log('📊 [TechnicalDayTable] received data:', data);
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🧠 Geen data fallback
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen technische dagdata beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {/* 🔢 Totale technische score boven de tabel */}
      <tr className="bg-gray-50 dark:bg-gray-800 border-t border-b dark:border-gray-700">
        <td colSpan={6} className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <div>
              📈 Totale Technische Score:{' '}
              <span className={`font-bold ${getScoreColor(overallScore)}`}>
                {overallScore !== null ? overallScore : '–'}
              </span>
            </div>
            <div>
              Advies:{' '}
              <span className="font-semibold text-gray-800 dark:text-white">
                {overallAdvies || 'Neutral'}
              </span>
            </div>
          </div>
        </td>
      </tr>

      {/* 📋 Indicator-rijen */}
      {data.map((item, index) => {
        const {
          indicator = '–',
          waarde = '–',
          score = null,
          advies = '–',
          uitleg = '–',
          symbol,
        } = item;

        return (
          <tr key={symbol || `row-${index}`} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{indicator}</td>
            <td className="p-2 text-center">{waarde}</td>
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score !== null ? score : '–'}
            </td>
            <td className="p-2 text-center">{advies}</td>
            <td className="p-2">{uitleg}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => {
                  console.log('🗑️ Removing:', symbol || `item-${index}`);
                  onRemove?.(symbol || `item-${index}`);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}

      {/* 🧪 Debugmodus */}
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
