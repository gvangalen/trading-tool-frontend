'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
dayjs.locale('nl');

export default function MacroWeekTable({ data = [], onRemove, showDebug = false }) {
  // 🧠 Log voor debug
  useEffect(() => {
    console.log('📅 [MacroWeekTable] ontvangen data:', data);
    console.table(
      data.flatMap((groep) =>
        groep.data.map((d) => ({
          indicator: d.indicator,
          score: d.score,
          timestamp: d.timestamp,
        }))
      )
    );
  }, [data]);

  // 🎨 Kleur op basis van score
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
        <td colSpan={7} className="p-4 text-center text-gray-500 italic">
          ⚠️ Geen macro weekdata beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((groep) => (
        <tbody key={groep.label}>
          {/* 🗓️ Datumgroep */}
          <tr className="bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700">
            <td colSpan={7} className="font-semibold p-3 text-sm">
              {groep.label}
            </td>
          </tr>

          {/* 📋 Kolomtitels */}
          <tr className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
            <th className="p-2 text-left">Indicator</th>
            <th className="p-2 text-center">Waarde</th>
            <th className="p-2 text-center">Trend</th>
            <th className="p-2 text-center">Interpretatie</th>
            <th className="p-2 text-center">Actie</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Verwijder</th>
          </tr>

          {/* 📊 Indicatorgegevens */}
          {groep.data.map((item, index) => {
            const {
              indicator = '–',
              waarde = item.waarde ?? item.value ?? '–',
              trend = item.trend ?? '–',
              uitleg = item.uitleg ?? item.interpretation ?? '–',
              advies = item.advies ?? item.action ?? '–',
              score = item.score,
              symbol,
            } = item;

            return (
              <tr
                key={`${groep.label}-${symbol || index}`}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-2 font-medium text-gray-800 dark:text-gray-200">{indicator}</td>
                <td className="p-2 text-center">{waarde}</td>
                <td className="p-2 text-center italic text-gray-500">{trend}</td>
                <td className="p-2 text-center italic text-gray-500">{uitleg}</td>
                <td className="p-2 text-center italic text-gray-500">{advies}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
                  {isNaN(score) ? '–' : score}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onRemove?.(symbol || `item-${index}`)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    title="Verwijder deze regel"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      ))}

      {/* 🧪 Debugsectie */}
      {showDebug && (
        <tfoot>
          <tr>
            <td colSpan={7}>
              <pre className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-64 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </td>
          </tr>
        </tfoot>
      )}
    </>
  );
}
