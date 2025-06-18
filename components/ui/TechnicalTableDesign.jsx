'use client';

import React from 'react';
import CardWrapper from './CardWrapper';
import clsx from 'clsx';

export default function TechnicalTableDesign({ data }) {
  return (
    <CardWrapper title="📊 Technische Analyse">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 font-semibold">Asset</th>
              <th className="px-4 py-2 font-semibold">Timeframe</th>
              <th className="px-4 py-2 font-semibold">Volume</th>
              <th className="px-4 py-2 font-semibold">RSI</th>
              <th className="px-4 py-2 font-semibold">200MA</th>
              <th className="px-4 py-2 font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.asset + row.timeframe}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.asset}</td>
                <td className="px-4 py-2">{row.timeframe}</td>
                <td className="px-4 py-2">
                  {row.volume} {row.volumeTrend === 'up' ? '↑' : row.volumeTrend === 'down' ? '↓' : ''}
                </td>
                <td
                  className={clsx(
                    'px-4 py-2 font-semibold',
                    row.rsi >= 70
                      ? 'text-red-500'
                      : row.rsi <= 30
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  )}
                >
                  {row.rsi}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={clsx(
                      'font-semibold',
                      row.ma200 === 'Above' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {row.ma200}
                  </span>
                </td>
                <td className="px-4 py-2 font-semibold">{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
