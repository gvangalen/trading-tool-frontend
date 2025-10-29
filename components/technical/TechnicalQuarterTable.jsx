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
 * 🧩 TechnicalQuarterTable
 * Data is gegroepeerd zoals:
 * [{ label: '📊 Kwartaal 3 – 2025', data: [...] }, ...]
 */
export default function TechnicalQuarterTable({ data, onRemove }) {
  const isValidData = Array.isArray(data) && data.length > 0;

  if (!isValidData) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen technische kwartaal-data beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((groep, i) => (
        <React.Fragment key={groep?.label || `groep-${i}`}>
          {/* 📊 Kwartaalheader */}
          <tr className="bg-blue-50 dark:bg-blue-900">
            <td colSpan={6} className="p-2 font-semibold text-blue-800 dark:text-blue-200">
              {groep.label ?? '📊 Onbekend kwartaal'}
            </td>
          </tr>

          {/* 🔁 Indicatoren in deze kwartaalgroep */}
          {Array.isArray(groep.data) &&
            groep.data.map((item, index) => (
              <tr
                key={item.symbol || `${item.indicator}-${index}`}
                className="border-t dark:border-gray-700"
              >
                <td className="p-2 font-medium">{item.indicator ?? '–'}</td>
                <td className="p-2 text-center">{item.waarde ?? item.value ?? '–'}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
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
