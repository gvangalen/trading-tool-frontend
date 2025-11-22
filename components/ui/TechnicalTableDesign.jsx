'use client';

import React from 'react';
import CardWrapper from './CardWrapper';
import clsx from 'clsx';

// Luxe lucide icons
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  ChevronUp,
  ChevronDown,
  Circle,
  Activity,
} from "lucide-react";

export default function TechnicalTableDesign({ data }) {
  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--text-dark)]" />
          <span>Technische Analyse</span>
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
                  <Circle className="w-3 h-3" /> Asset
                </div>
              </th>
              <th className="px-4 py-3 font-semibold">Timeframe</th>
              <th className="px-4 py-3 font-semibold">Volume</th>
              <th className="px-4 py-3 font-semibold">RSI</th>
              <th className="px-4 py-3 font-semibold">200MA</th>
              <th className="px-4 py-3 font-semibold">Trend</th>
            </tr>
          </thead>

          {/* ---------------- BODY ---------------- */}
          <tbody>
            {data.map((row) => {
              const VolumeIcon =
                row.volumeTrend === "up"
                  ? ChevronUp
                  : row.volumeTrend === "down"
                  ? ChevronDown
                  : Circle;

              const TrendIcon =
                row.trend === "Up"
                  ? TrendingUp
                  : row.trend === "Down"
                  ? TrendingDown
                  : BarChart2;

              return (
                <tr
                  key={row.asset + row.timeframe}
                  className="
                    border-b border-[var(--border)]
                    hover:bg-[var(--bg-soft)]
                    transition-all
                  "
                >

                  {/* Asset */}
                  <td className="px-4 py-3 font-medium text-[var(--text-dark)]">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-[var(--text-light)]" />
                      {row.asset}
                    </div>
                  </td>

                  {/* Timeframe */}
                  <td className="px-4 py-3 text-[var(--text-dark)]">
                    {row.timeframe}
                  </td>

                  {/* Volume + trend */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <VolumeIcon
                        className={clsx(
                          "w-4 h-4",
                          row.volumeTrend === "up"
                            ? "text-green-600"
                            : row.volumeTrend === "down"
                            ? "text-red-500"
                            : "text-gray-400"
                        )}
                      />
                      {Number(row.volume).toLocaleString()}
                    </div>
                  </td>

                  {/* RSI ± kleurcode */}
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold",
                      row.rsi >= 70
                        ? "text-red-500"
                        : row.rsi <= 30
                        ? "text-green-600"
                        : "text-yellow-500"
                    )}
                  >
                    {row.rsi}
                  </td>

                  {/* 200MA */}
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "font-semibold flex items-center gap-1",
                        row.ma200 === "Above"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      <Circle className="w-3 h-3" />
                      {row.ma200}
                    </span>
                  </td>

                  {/* Trend */}
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold flex items-center gap-2",
                      row.trend === "Up"
                        ? "text-green-600"
                        : row.trend === "Down"
                        ? "text-red-600"
                        : "text-gray-500"
                    )}
                  >
                    <TrendIcon className="w-4 h-4" />
                    {row.trend}
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
