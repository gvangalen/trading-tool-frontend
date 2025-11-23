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

/* -----------------------------------------------------
   SAFE HELPERS — voorkomt crashes in UI
----------------------------------------------------- */
const safeNum = (v, digits = null) => {
  if (v === null || v === undefined) return "–";
  if (typeof v !== "number") return "–";
  return digits !== null ? v.toFixed(digits) : v;
};

const safeText = (v) => (v ? v : "–");

const formatNum = (v) => {
  if (typeof v !== "number") return "–";
  return v.toLocaleString();
};

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
              // veilige values
              const asset = safeText(row.asset);
              const timeframe = safeText(row.timeframe);
              const volume = formatNum(row.volume);
              const rsi = safeNum(row.rsi);

              // volume trend icon
              const VolumeIcon =
                row.volumeTrend === "up"
                  ? ChevronUp
                  : row.volumeTrend === "down"
                  ? ChevronDown
                  : Circle;

              const volumeColor =
                row.volumeTrend === "up"
                  ? "text-green-600"
                  : row.volumeTrend === "down"
                  ? "text-red-500"
                  : "text-gray-400";

              // overall trend icon
              const TrendIcon =
                row.trend === "Up"
                  ? TrendingUp
                  : row.trend === "Down"
                  ? TrendingDown
                  : BarChart2;

              const trendColor =
                row.trend === "Up"
                  ? "text-green-600"
                  : row.trend === "Down"
                  ? "text-red-600"
                  : "text-gray-500";

              // RSI kleur
              const rsiColor =
                typeof row.rsi === "number"
                  ? row.rsi >= 70
                    ? "text-red-500"
                    : row.rsi <= 30
                    ? "text-green-600"
                    : "text-yellow-500"
                  : "text-gray-500";

              // 200MA kleur
              const maColor =
                row.ma200 === "Above"
                  ? "text-green-600"
                  : "text-red-600";

              return (
                <tr
                  key={asset + timeframe}
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
                      {asset}
                    </div>
                  </td>

                  {/* Timeframe */}
                  <td className="px-4 py-3 text-[var(--text-dark)]">
                    {timeframe}
                  </td>

                  {/* Volume */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <VolumeIcon className={clsx("w-4 h-4", volumeColor)} />
                      {volume}
                    </div>
                  </td>

                  {/* RSI */}
                  <td className={clsx("px-4 py-3 font-semibold", rsiColor)}>
                    {rsi}
                  </td>

                  {/* 200MA */}
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "font-semibold flex items-center gap-1",
                        maColor
                      )}
                    >
                      <Circle className="w-3 h-3" />
                      {safeText(row.ma200)}
                    </span>
                  </td>

                  {/* Trend */}
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold flex items-center gap-2",
                      trendColor
                    )}
                  >
                    <TrendIcon className="w-4 h-4" />
                    {safeText(row.trend)}
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
