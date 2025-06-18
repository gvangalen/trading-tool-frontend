'use client';

import React from 'react';
import CardWrapper from './CardWrapper';

export default function MacroTableDesign({ data }) {
  return (
    <CardWrapper title="🌍 Macro-Indicatoren">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 font-semibold">Naam</th>
              <th className="px-4 py-2 font-semibold">Trend</th>
              <th className="px-4 py-2 font-semibold">Waarde</th>
              <th className="px-4 py-2 font-semibold">Interpretatie</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.name}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className={`px-4 py-2 font-medium ${
                  row.trend === 'Up' ? 'text-green-600' :
                  row.trend === 'Down' ? 'text-red-500' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  {row.trend}
                </td>
                <td className="px-4 py-2">{row.value}</td>
                <td className="px-4 py-2">{row.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
