'use client';

import React from 'react';

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
 * 🧩 MacroMonthTable
 * Data is gegroepeerd per maand (zoals: 📅 September 2025)
 */
export default function MacroMonthTable({ data, onRemove }) {
  const isValidData = Array.isArray(data) && data.length > 0;

  if (!isValidData) {
    return (
      <tr>
        <td colSpan={7} className="p-4 text-center text-gray-500 italic">
          ⚠️ Geen maandelijkse macrodata beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((groep, i) => (
        <React.Fragment key={groep?.label || `groep-${i}`}>
          {/* 📅 Maandheader */}
          <tr className="bg-blue-50 dark:bg-blue-900">
            <td colSpan={7} className="p-2 font-semibold text-blue-800 dark:text-blue-200">
              {groep.label ?? '📅 Onbekende maand'}
            </td>
          </tr>

          {/* 🔁 Indicatoren in deze maandgroep */}
          {Array.isArray(groep.data) &&
            groep.data.map((item, index) => (
              <tr
                key={item.symbol || `${item.indicator}-${index}`}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-2 font-medium">{item.indicator ?? '–'}</td>
                <td className="p-2 text-center">{item.waarde ?? item.value ?? '–'}</td>
                <td className="p-2 text-center italic text-gray-500">{item.trend ?? '–'}</td>
                <td className="p-2 text-center italic text-gray-500">{item.uitleg ?? item.interpretation ?? '–'}</td>
                <td className="p-2 text-center italic text-gray-500">{item.advies ?? item.action ?? '–'}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
                  {isNaN(item.score) ? '–' : item.score}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onRemove?.(item.symbol || item.indicator)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
