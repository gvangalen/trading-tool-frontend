'use client';

import React from 'react';
import CardWrapper from './CardWrapper';

export default function MacroTableDesign({ data }) {
  return (
    <CardWrapper title="Macro-Indicatoren">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2">Naam</th>
              <th className="px-4 py-2">Trend</th>
              <th className="px-4 py-2">Waarde</th>
              <th className="px-4 py-2">Interpretatie</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.name}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-2">{row.trend}</td>
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
