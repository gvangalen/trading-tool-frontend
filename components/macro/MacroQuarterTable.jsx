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
 * 🧩 MacroQuarterTable
 * Data is gegroepeerd zoals:
 * [{ label: '📊 Kwartaal 3 – 2025', data: [...] }, ...]
 */
export default function MacroQuarterTable({ data, onRemove }) {
  const isValidData = Array.isArray(data) && data.length > 0;

  if (!isValidData) {
    return (
      <tr>
        <td colSpan={7} className="p-4 text-center text-gray-500 italic">
          ⚠️ Geen macro kwartaaldata beschikbaar.
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
            <td colSpan={7} className="p-2 font-semibold text-blue-800 dark:text-blue-200">
              {groep.label ?? '📊 Onbekend kwartaal'}
            </td>
          </tr>

          {/* 🔁 Indicatoren in deze kwartaalgroep */}
          {Array.isArray(groep.data) &&
            groep.data.map((item, index) => {
              const {
                name = '–',
                value = '–',
                trend = '–',
                interpretation = '–',
                action = '–',
                score = null,
              } = item;

              return (
                <tr
                  key={`${name}-${index}`}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-2 font-medium">{name}</td>
                  <td className="p-2 text-center">{value}</td>
                  <td className="p-2 text-center italic text-gray-500">{trend}</td>
                  <td className="p-2 text-center">{interpretation}</td>
                  <td className="p-2 text-center">{action}</td>
                  <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
                    {score !== null && !isNaN(score) ? score : '–'}
                  </td>
                  <td className="p-2 text-center">
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
        </React.Fragment>
      ))}
    </>
  );
}
