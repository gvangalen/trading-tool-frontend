'use client';

import React from 'react';

function getScoreColor(score) {
  const s = typeof score === 'number' ? score : parseFloat(score);
  if (isNaN(s)) return 'text-gray-600';
  if (s >= 75) return 'text-green-600';
  if (s <= 25) return 'text-red-600';
  return 'text-yellow-600';
}

export default function MacroWeekTable({ data = [], getExplanation, onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="p-4 text-center text-gray-500">
          ⚠️ Geen macrodata beschikbaar voor deze week.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((groep) => (
        <React.Fragment key={groep.label}>
          {/* 🗓️ Datumgroep header */}
          <tr className="bg-blue-50 dark:bg-blue-900">
            <td colSpan={7} className="p-2 font-semibold text-blue-800 dark:text-blue-200">
              {groep.label}
            </td>
          </tr>

          {/* 📊 Indicatoren */}
          {groep.data.map((item, index) => (
            <tr key={item.symbol || `${item.indicator}-${index}`} className="border-t dark:border-gray-700">
              {/* 📌 Indicatornaam met hover-uitleg */}
              <td className="p-2 font-medium" title={getExplanation?.(item.indicator) || ''}>
                {item.indicator ?? '–'}
              </td>

              {/* 📌 Waarde */}
              <td className="p-2 text-gray-500">{item.waarde ?? item.value ?? '–'}</td>

              {/* 📌 Trend */}
              <td className="p-2 italic text-gray-500">{item.trend ?? '–'}</td>

              {/* 📌 Interpretatie */}
              <td className="p-2 italic text-gray-500">{item.uitleg ?? '–'}</td>

              {/* 📌 Actie */}
              <td className="p-2 italic text-gray-500">{item.advies ?? '–'}</td>

              {/* 📌 Score */}
              <td className={`p-2 font-bold text-center ${getScoreColor(item.score)}`}>
                {isNaN(item.score) ? '–' : item.score}
              </td>

              {/* 📌 Verwijderknop */}
              <td className="p-2 text-center">
                {onRemove ? (
                  <button
                    onClick={() => onRemove(item.symbol || item.indicator)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Verwijder indicator"
                  >
                    ❌
                  </button>
                ) : (
                  <span className="text-gray-400">–</span>
                )}
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
