'use client';

import React from 'react';
import CardWrapper from './CardWrapper';
import clsx from 'clsx';

export default function MarketTableDesign({ data }) {
  return (
    <CardWrapper title="📈 Market Overview">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 font-semibold">Asset</th>
              <th className="px-4 py-2 font-semibold">Prijs</th>
              <th className="px-4 py-2 font-semibold">24u %</th>
              <th className="px-4 py-2 font-semibold">24u Volume</th>
              <th className="px-4 py-2 font-semibold">RSI</th>
              <th className="px-4 py-2 font-semibold">200MA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.asset}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.asset}</td>
                <td className="px-4 py-2">${row.price}</td>
                <td
                  className={clsx(
                    'px-4 py-2 font-semibold',
                    row.change24h > 0
                      ? 'text-green-500'
                      : row.change24h < 0
                      ? 'text-red-500'
                      : 'text-gray-500'
                  )}
                >
                  {row.change24h > 0 ? '▲' : row.change24h < 0 ? '▼' : '—'} {row.change24h.toFixed(2)}%
                </td>
                <td className="px-4 py-2">{row.volume24h}</td>
                <td className="px-4 py-2">{row.rsi}</td>
                <td className="px-4 py-2">
                  <span
                    className={clsx(
                      'font-semibold',
                      row.above200ma ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {row.above200ma ? 'Above' : 'Below'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
