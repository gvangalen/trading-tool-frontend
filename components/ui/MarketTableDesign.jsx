'use client';

import React from 'react';
import CardWrapper from './CardWrapper';
import clsx from 'clsx';

// Luxe lucide-react icons
import { LineChart, TrendingUp, TrendingDown, Circle } from "lucide-react";

export default function MarketTableDesign({ data }) {
  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-[var(--text-dark)]" />
          <span>Market Overview</span>
        </div>
      }
    >
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">

          {/* ---------------- HEADER ---------------- */}
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Asset
                </div>
              </th>
              <th className="px-4 py-3 font-semibold">Prijs</th>
              <th className="px-4 py-3 font-semibold">24u %</th>
              <th className="px-4 py-3 font-semibold">24u Volume</th>
              <th className="px-4 py-3 font-semibold">RSI</th>
              <th className="px-4 py-3 font-semibold">200MA</th>
            </tr>
          </thead>

          {/* ---------------- ROWS ---------------- */}
          <tbody>
            {data.map((row) => {
              const ChangeIcon =
                row.change24h > 0
                  ? TrendingUp
                  : row.change24h < 0
                  ? TrendingDown
                  : Circle;

              return (
                <tr
                  key={row.asset}
                  className="
                    border-b border-[var(--border)]
                    hover:bg-[var(--bg-soft)]
                    transition-all
                  "
                >
                  {/* Asset */}
                  <td className="px-4 py-3 font-medium text-[var(--text-dark)]">
                    <div className="flex items-center gap-2">
                      {/* Placeholder voor icons → kan later BTC/ETH icoontjes worden */}
                      <Circle className="w-4 h-4 text-[var(--text-light)]" />
                      {row.asset}
                    </div>
                  </td>

                  {/* Prijs */}
                  <td className="px-4 py-3">
                    ${Number(row.price).toLocaleString()}
                  </td>

                  {/* 24h Change */}
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold flex items-center gap-2",
                      row.change24h > 0
                        ? "text-green-600"
                        : row.change24h < 0
                        ? "text-red-500"
                        : "text-gray-500"
                    )}
                  >
                    <ChangeIcon className="w-4 h-4" />
                    {row.change24h.toFixed(2)}%
                  </td>

                  {/* Volume */}
                  <td className="px-4 py-3">
                    {Number(row.volume24h).toLocaleString()}
                  </td>

                  {/* RSI */}
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "font-semibold",
                        row.rsi < 30
                          ? "text-green-600"
                          : row.rsi > 70
                          ? "text-red-500"
                          : "text-yellow-500"
                      )}
                    >
                      {row.rsi}
                    </span>
                  </td>

                  {/* 200MA */}
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "font-semibold flex items-center gap-1",
                        row.above200ma ? "text-green-600" : "text-red-600"
                      )}
                    >
                      <Circle className="w-3 h-3" />
                      {row.above200ma ? "Above" : "Below"}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
