'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
dayjs.locale('nl');

/**
 * 📊 MacroWeekTable
 * Data gegroepeerd per week (zoals: 📅 Week 43 – 2025)
 */
export default function MacroWeekTable({ data = [], onRemove, showDebug = false }) {
  useEffect(() => {
    console.log('📅 [MacroWeekTable] ontvangen data:', data);
    console.table(
      data.flatMap((groep) =>
        (groep?.data || []).map((d) => ({
          name: d.name,
          score: d.score,
          timestamp: d.timestamp,
        }))
      )
    );
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
      <div className="w-full text-center p-4 text-gray-500 italic">
        ⚠️ Geen macro weekdata beschikbaar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[1000px] w-full text-sm text-left text-gray-800 dark:text-gray-200 border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
            <th className="p-3 text-left">📊 Indicator</th>
            <th className="p-3 text-center">Waarde</th>
            <th className="p-3 text-center">Score</th>
            <th className="p-3 text-center">Advies</th>
            <th className="p-3 text-center">Uitleg</th>
            <th className="p-3 text-center">🗑️</th>
          </tr>
        </thead>

        <tbody>
          {data.map((groep, groepIndex) => (
            <>
              {/* 📅 Weekheader */}
              <tr
                key={`header-${groepIndex}`}
                className="bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700"
              >
                <td colSpan={6} className="font-semibold p-3 text-sm">
                  {groep.label ?? `📅 Week ${groepIndex + 1}`}
                </td>
              </tr>

              {/* 🔁 Indicatoren in deze weekgroep */}
              {(groep?.data || []).map((item, index) => {
                const {
                  name = '–',
                  value = '–',
                  score = null,
                  interpretation = '–',
                  action = '–',
                } = item;

                return (
                  <tr
                    key={`${groep.label || 'groep'}-${name}-${index}`}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3 font-medium">{name}</td>
                    <td className="p-3 text-center">{value}</td>
                    <td className={`p-3 text-center font-bold ${getScoreColor(score)}`}>
                      {score !== null && !isNaN(score) ? Math.round(score) : '–'}
                    </td>
                    <td className="p-3 text-center italic text-gray-500">{action}</td>
                    <td className="p-3 text-center italic text-gray-500">{interpretation}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onRemove?.(name)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        title={`Verwijder ${name}`}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>

        {/* 🧪 Debugmodus */}
        {showDebug && (
          <tfoot>
            <tr>
              <td colSpan={6}>
                <pre className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-64 overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
