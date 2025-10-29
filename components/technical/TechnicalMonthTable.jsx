'use client';

import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

/**
 * ✅ Hulpfunctie: geef een weeklabel zoals "📅 Week 43 – 2025"
 */
function getWeekLabel(timestamp) {
  const date = new Date(timestamp);
  const weekNumber = parseInt(format(date, 'I', { locale: nl }));
  const year = format(date, 'yyyy', { locale: nl });
  return `📅 Week ${weekNumber} – ${year}`;
}

/**
 * ✅ Scorekleur bepalen op basis van scorewaarde
 */
function getScoreColor(score) {
  const s = typeof score === 'number' ? score : parseFloat(score);
  if (isNaN(s)) return 'text-gray-600';
  if (s >= 70) return 'text-green-600';
  if (s <= 40) return 'text-red-600';
  return 'text-yellow-600';
}

/**
 * 🧩 TechnicalMonthTable
 * Groepeert maanddata in 4 weken (per weeklabel)
 */
export default function TechnicalMonthTable({ data = [], onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen maandelijkse technische data beschikbaar.
        </td>
      </tr>
    );
  }

  // ✅ Groepeer items per weeklabel (bijv. Week 43 – 2025)
  const grouped = data.reduce((acc, item) => {
    const label = item.timestamp ? getWeekLabel(item.timestamp) : '📅 Onbekende week';
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([weekLabel, items]) => (
        <React.Fragment key={weekLabel}>
          {/* 🟦 Weekheader */}
          <tr className="bg-blue-50 dark:bg-blue-900">
            <td
              colSpan={6}
              className="p-2 font-semibold text-blue-800 dark:text-blue-200"
            >
              {weekLabel}
            </td>
          </tr>

          {/* 🔁 Indicatoren per week */}
          {items.map((item, index) => (
            <tr
              key={item.symbol || `${item.indicator}-${index}`}
              className="border-t dark:border-gray-700"
            >
              <td className="p-2 font-medium">{item.indicator ?? '–'}</td>
              <td className="p-2 text-center">{item.waarde ?? item.value ?? '–'}</td>
              <td
                className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}
              >
                {item.score ?? '–'}
              </td>
              <td className="p-2 text-center">{item.advies ?? '–'}</td>
              <td className="p-2">{item.uitleg ?? '–'}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => onRemove?.(item.symbol || item.indicator)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Verwijder indicator"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
