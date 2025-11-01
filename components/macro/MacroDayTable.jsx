'use client';

import { useEffect } from 'react';

export default function MacroDayTable({
  data = [],
  onRemove,
  showDebug = false,
  getExplanation,
}) {
  useEffect(() => {
    console.log('📊 [MacroDayTable] received data:', data);
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
          ⚠️ Geen macro dagdata beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {/* 📋 Indicator-rijen */}
      {data.map((item, index) => {
        const {
          indicator = '–',
          waarde = '–',
          score = null,
          advies = item.advies || item.action || '–',
          uitleg = item.uitleg || item.interpretatie || 'Geen uitleg beschikbaar',
          symbol,
        } = item;

        return (
          <tr
            key={symbol || `row-${index}`}
            className="border-t dark:border-gray-700"
          >
            <td className="p-2 font-medium" title={getExplanation?.(indicator)}>
              {indicator}
            </td>
            <td className="p-2 text-center">{waarde}</td>
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score !== null ? score : '–'}
            </td>
            <td className="p-2">{advies}</td>
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
