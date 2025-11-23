'use client';

import React from 'react';
import CardWrapper from './CardWrapper';

// Luxe lucide icons – zelfde stijl als sidebar
import { Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";

/* -----------------------------------------------------
   SAFE HELPERS → voorkomt elke .toFixed crash
----------------------------------------------------- */
const safeValue = (v) => {
  if (v === null || v === undefined) return "–";
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  return "–";
};

const safeScore = (s) => {
  // score kan number zijn → return direct
  if (typeof s === "number") return s;

  // score kan object zijn → backend gebruikt deze structuur:
  // { value: 65, trend: "...", interpretation: "...", advies: "..." }
  if (typeof s === "object" && s !== null) {
    if (typeof s.value === "number") return s.value;
  }

  return "–";
};

const safeText = (v) => (v ? v : "–");


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
              const trend = row.trend || row.score?.trend || "Neutral";

              const TrendIcon =
                trend === "Up"
                  ? TrendingUp
                  : trend === "Down"
                  ? TrendingDown
                  : Minus;

              const trendColor =
                trend === "Up"
                  ? "text-green-600"
                  : trend === "Down"
                  ? "text-red-500"
                  : "text-gray-500";

              const scoreValue = safeScore(row.score);

              // dynamische kleur voor score
              const scoreColor =
                typeof scoreValue === "number"
                  ? scoreValue >= 75
                    ? "var(--green)"
                    : scoreValue >= 50
                    ? "#FBBF24"
                    : "var(--red)"
                  : "var(--text-light)";

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
                      {safeText(row.name)}
                    </div>
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-3 font-medium">
                    <div className={`flex items-center gap-2 ${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                      {safeText(trend)}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3">{safeValue(row.value)}</td>

                  {/* Score */}
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: scoreColor }}
                  >
                    {scoreValue}
                  </td>

                  {/* Advies */}
                  <td className="px-4 py-3 text-[var(--text-dark)]">
                    {safeText(row.advice || row.score?.advies)}
                  </td>

                  {/* Uitleg */}
                  <td className="px-4 py-3 text-[var(--text-light)]">
                    {safeText(row.interpretation || row.score?.interpretation)}
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
