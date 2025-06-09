'use client';

import React from 'react';
import CardWrapper from './CardWrapper';

export default function TechnicalTableDesign({ data }) {
  return (
    <CardWrapper title="Technische Indicatoren">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2">Timeframe</th>
              <th className="px-4 py-2">Volume</th>
              <th className="px-4 py-2">RSI</th>
              <th className="px-4 py-2">200MA</th>
              <th className="px-4 py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.asset + row.timeframe}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.asset}</td>
                <td className="px-4 py-2">{row.timeframe}</td>
                <td className="px-4 py-2">{row.volume}</td>
                <td className="px-4 py-2">{row.rsi}</td>
                <td className="px-4 py-2">{row.ma200}</td>
                <td className="px-4 py-2">{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
