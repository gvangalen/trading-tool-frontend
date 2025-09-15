'use client';

import { useEffect } from 'react';

export default function TechnicalDayTable({ data = [], onRemove, showDebug = true }) {
  useEffect(() => {
    console.log('📊 TechnicalDayTable received data:', data);
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  const getValue = (indicator) => {
    const item = data.find((d) => d.indicator === indicator);
    return {
      value: item?.waarde ?? '–',
      score: item?.score ?? '–',
      advies: item?.advies ?? '–',
      uitleg: item?.uitleg ?? '–',
      symbol: item?.symbol ?? indicator,
    };
  };

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

  const rows = [
    { label: 'RSI', ...getValue('RSI') },
    { label: 'Volume', ...getValue('Volume') },
    { label: '200MA', ...getValue('200MA') },
  ];

  return (
    <>
      {rows.map(({ label, value, score, advies, uitleg, symbol }) => (
        <tr key={label} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{label}</td>
          <td className="p-2 text-center">{value}</td>
          <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
            {score}
          </td>
          <td className="p-2 text-center">{advies}</td>
          <td className="p-2">{uitleg}</td>
          <td className="p-2 text-center">
            <button
              onClick={() => onRemove?.(symbol)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌
            </button>
          </td>
        </tr>
      ))}

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
