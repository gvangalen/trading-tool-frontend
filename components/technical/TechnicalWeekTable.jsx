'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
dayjs.locale('nl');

export default function TechnicalWeekTable({ data = [], onRemove, showDebug = false }) {
  useEffect(() => {
    console.log('📅 [TechnicalWeekTable] received data:', data);
    console.table(
      data.map((d) => ({
        indicator: d.indicator,
        score: d.score,
        timestamp: d.timestamp,
      }))
    );
  }, [data]);

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // ✅ Groepeer op basis van geldige timestamp (YYYY-MM-DD)
  const grouped = data.reduce((acc, item) => {
    const raw = item.timestamp;
    let dateKey = 'onbekend';

    if (raw) {
      const parsed = dayjs(raw);
      if (parsed.isValid()) {
        dateKey = parsed.format('YYYY-MM-DD');
      } else {
        console.warn('⚠️ Ongeldige datum:', raw);
      }
    } else {
      console.warn('⚠️ Geen timestamp gevonden voor item:', item);
    }

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen technische weekdata beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {Object.entries(grouped).map(([dateKey, items]) => (
        <tbody key={dateKey}>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <td colSpan={6} className="font-semibold p-2">
              📅 {dateKey !== 'onbekend' ? dayjs(dateKey).format('dddd D MMMM YYYY') : '📁 Onbekende datum'}
            </td>
          </tr>

          {items.map((item, index) => {
            const {
              indicator = '–',
              value,
              score = null,
              advies = '–',
              uitleg = item.uitleg ?? item.explanation ?? '–',
              symbol,
            } = item;

            const waarde = value ?? item.waarde ?? '–';

            return (
              <tr
                key={`${dateKey}-${symbol || index}`}
                className="border-t dark:border-gray-700"
              >
                <td className="p-2 font-medium">{indicator}</td>
                <td className="p-2 text-center">{waarde}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
                  {score !== null ? score : '–'}
                </td>
                <td className="p-2 text-center">{advies}</td>
                <td className="p-2">{uitleg}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onRemove?.(symbol || `item-${index}`)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      ))}

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
    </>
  );
}
