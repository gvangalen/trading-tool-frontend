"use client";

import React from "react";
import CardWrapper from "./CardWrapper";

// Lucide icons – consistent PRO style
import {
  AlertCircle,
  Trash2,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

/* -------------------------------------------------------
   SAFE HELPERS → voorkomen crashes op undefined / objects
------------------------------------------------------- */
const safeValue = (v) => {
  if (v === null || v === undefined) return "–";
  if (typeof v === "number")
    return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (typeof v === "string") return v;
  return "–";
};

const safeScore = (score) => {
  if (typeof score === "number") return score;
  if (typeof score === "object" && score !== null) {
    if (typeof score.value === "number") return score.value;
  }
  return null;
};

const safeText = (v) =>
  v && String(v).trim().length > 0 ? String(v) : "–";

const scoreColorClass = (scoreValue) => {
  if (typeof scoreValue !== "number")
    return "text-[var(--text-light)]";

  if (scoreValue >= 75) return "text-green-600";
  if (scoreValue >= 50) return "text-yellow-500";
  return "text-red-500";
};

export default function DayTable({ title, icon, data = [], onRemove }) {
  const rows = Array.isArray(data) ? data : [];

  return (
    <CardWrapper
      title={
        title ? (
          <div className="flex items-center gap-2">
            {icon && <span>{icon}</span>}
            <span>{title}</span>
          </div>
        ) : null
      }
    >
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          {/* -------------------- HEADER -------------------- */}
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-4 py-3 text-left font-semibold">
                Indicator
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Waarde
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Score
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Advies
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Uitleg
              </th>
              {onRemove && (
                <th className="px-4 py-3 text-center font-semibold">
                  Actie
                </th>
              )}
            </tr>
          </thead>

          {/* -------------------- BODY -------------------- */}
          <tbody>
            {/* Geen data */}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={onRemove ? 6 : 5}
                  className="px-4 py-6 text-center text-[var(--text-light)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Geen indicatoren gevonden.</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const name =
                  row.display_name ||
                  row.name ||
                  row.indicator ||
                  "–";

                const rawValue =
                  row.value ??
                  row.waarde ??
                  row.current ??
                  row.latest_value ??
                  null;

                const scoreValue = safeScore(
                  row.score ?? row.score_value
                );

                const scoreClass = scoreColorClass(scoreValue);

                const advice =
                  row.advice ??
                  row.advies ??
                  row.action ??
                  row.score?.advies ??
                  null;

                const explanation =
                  row.interpretation ??
                  row.uitleg ??
                  row.score?.interpretation ??
                  "";

                // trend icon (indien aanwezig)
                const trend = row.trend ?? row.score?.trend ?? null;
                let TrendIcon = Minus;
                let trendClass = "text-gray-500";

                if (trend === "Up") {
                  TrendIcon = TrendingUp;
                  trendClass = "text-green-600";
                } else if (trend === "Down") {
                  TrendIcon = TrendingDown;
                  trendClass = "text-red-600";
                }

                return (
                  <tr
                    key={`${name}-${idx}`}
                    className="border-b border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition-colors"
                  >
                    {/* Indicator */}
                    <td className="px-4 py-3 font-medium text-[var(--text-dark)] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[var(--text-light)]" />
                        {safeText(name)}
                      </div>
                    </td>

                    {/* Waarde */}
                    <td className="px-4 py-3 text-center">
                      {safeValue(rawValue)}
                    </td>

                    {/* Score */}
                    <td
                      className={`px-4 py-3 text-center font-semibold ${scoreClass}`}
                    >
                      {scoreValue !== null ? scoreValue : "–"}
                    </td>

                    {/* Advies */}
                    <td className="px-4 py-3 text-center text-[var(--text-dark)]">
                      {safeText(advice)}
                    </td>

                    {/* Uitleg */}
                    <td className="px-4 py-3 text-[var(--text-light)] leading-relaxed">
                      {safeText(explanation)}
                    </td>

                    {/* Verwijderen */}
                    {onRemove && (
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            name && onRemove(name)
                          }
                          className="
                            inline-flex items-center justify-center
                            p-1.5 rounded-md
                            bg-red-500 text-white
                            hover:bg-red-600
                            transition-colors
                          "
                          title={`Verwijder ${name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
