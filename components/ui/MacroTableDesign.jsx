'use client';

import React from 'react';
import CardWrapper from './CardWrapper';

// Luxe lucide icons – zelfde stijl als sidebar
import { Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MacroTableDesign({ data }) {
  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[var(--text-dark)]" />
          <span>Macro Indicatoren</span>
        </div>
      }
    >
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          {/* ---------------- TABLE HEADER ---------------- */}
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Indicator
                </div>
              </th>
              <th className="px-4 py-3 font-semibold">Trend</th>
              <th className="px-4 py-3 font-semibold">Waarde</th>
              <th className="px-4 py-3 font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Advies</th>
              <th className="px-4 py-3 font-semibold">Uitleg</th>
            </tr>
          </thead>

          {/* ---------------- TABLE BODY ---------------- */}
          <tbody>
            {data.map((row) => {
              const TrendIcon =
                row.trend === "Up"
                  ? TrendingUp
                  : row.trend === "Down"
                  ? TrendingDown
                  : Minus;

              const trendColor =
                row.trend === "Up"
                  ? "text-green-600"
                  : row.trend === "Down"
                  ? "text-red-500"
                  : "text-gray-500";

              return (
                <tr
                  key={row.name}
                  className="
                    border-b border-[var(--border)]
                    hover:bg-[var(--bg-soft)]
                    transition-all
                  "
                >
                  {/* Indicator name */}
                  <td className="px-4 py-3 font-medium text-[var(--text-dark)]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--text-light)]" />
                      {row.name}
                    </div>
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-3 font-medium">
                    <div className={`flex items-center gap-2 ${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                      {row.trend}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3">{row.value}</td>

                  {/* Score — kleur per range */}
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{
                      color:
                        row.score >= 75
                          ? "var(--green)"
                          : row.score >= 50
                          ? "#FBBF24"
                          : "var(--red)",
                    }}
                  >
                    {row.score}
                  </td>

                  {/* Advies */}
                  <td className="px-4 py-3 text-[var(--text-dark)]">
                    {row.advice}
                  </td>

                  {/* Uitleg */}
                  <td className="px-4 py-3 text-[var(--text-light)]">
                    {row.interpretation}
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
