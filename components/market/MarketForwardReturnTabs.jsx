'use client';

import { useState } from "react";
import {
  CalendarRange,
  TrendingUp,
  PieChart,
  BarChart3
} from "lucide-react";

/* ===========================================================
   🎨 PRO-KLEUREN
   Zachtere pastel heatmap (TradingView style)
=========================================================== */
const heatmapColor = (value) => {
  if (value === null || value === undefined) return "bg-[var(--bg-soft)] text-[var(--text-light)]";

  if (value > 12) return "bg-green-200 text-green-900";       // sterke win
  if (value > 5) return "bg-green-100 text-green-800";        // lichte win
  if (value < -12) return "bg-red-300 text-red-900";          // sterke verlies
  if (value < -5) return "bg-red-200 text-red-900";           // lichte verlies

  return "bg-[var(--bg-soft)] text-[var(--text-dark)]";       // neutraal
};

const tabs = ["Week", "Maand", "Kwartaal", "Jaar"];

const labelsByTab = {
  Week: Array.from({ length: 53 }, (_, i) => `W${i + 1}`),
  Maand: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  Kwartaal: ["Q1", "Q2", "Q3", "Q4"],
  Jaar: ["Year"],
};

const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "–";
  return `${value.toFixed(1)}%`;
};

/* ===========================================================
   🌟 HOOFD COMPONENT
=========================================================== */
export default function MarketForwardReturnTabs({ data = {} }) {
  const [active, setActive] = useState("Maand");
  const [selectedYears, setSelectedYears] = useState(() =>
    (data["maand"] || []).map((row) => row.year)
  );

  const activeKey = active.toLowerCase();
  const activeData = data[activeKey] || [];
  const labels = labelsByTab[active] || [];

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const calculateYearAvg = (values) => {
    const valid = values.filter((v) => v !== null && v !== undefined);
    if (!valid.length) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const calculateColumnAverages = () => {
    return labels.map((_, colIdx) => {
      const vals = activeData.map((row) => row.values[colIdx]);
      const valid = vals.filter((v) => v !== null && v !== undefined);
      if (!valid.length) return null;
      return valid.reduce((a, b) => a + b, 0) / valid.length;
    });
  };

  const colAverages = calculateColumnAverages();

  const selectedData = activeData.filter((row) =>
    selectedYears.includes(row.year)
  );

  const forwardStats = labels.map((_, idx) => {
    const vals = selectedData.map((row) => row.values[idx]);
    const valid = vals.filter((v) => v !== null && v !== undefined);
    const wins = valid.filter((v) => v > 0).length;
    const losses = valid.filter((v) => v <= 0).length;
    return {
      total: valid.length,
      wins,
      losses,
      rate: valid.length ? (wins / valid.length) * 100 : null,
    };
  });

  const displayData = activeData.length
    ? [...activeData].sort((a, b) => b.year - a.year)
    : [{ year: "–", values: Array(labels.length).fill(null) }];

  return (
    <div className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm space-y-6">

      {/* ======================================================
         ⭐ TABS (PRO-STIJL)
      ====================================================== */}
      <div className="flex gap-2 mb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border 
              ${
                active === tab
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow"
                  : "bg-[var(--bg-soft)] text-[var(--text-dark)] border-[var(--card-border)] hover:bg-[var(--bg-hover)]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ======================================================
         📊 HOOFDTABEL (HEATMAP MATRIX)
      ====================================================== */}
      <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] uppercase text-xs">
            <tr className="border-b border-[var(--card-border)]">
              <th className="p-3 text-left w-10">
                <CalendarRange className="w-4 h-4 text-[var(--text-light)]" />
              </th>
              <th className="p-3 text-left">Jaar</th>
              {labels.map((label) => (
                <th key={label} className="p-2 text-center">{label}</th>
              ))}
              <th className="p-2 text-center">Gem.</th>
            </tr>
          </thead>

          <tbody>
            {displayData.map((row, idx) => {
              const avg = calculateYearAvg(row.values);

              return (
                <tr key={idx} className="border-b border-[var(--card-border)]">
                  {/* Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(row.year)}
                      onChange={() => toggleYear(row.year)}
                      disabled={row.year === "–"}
                      className="w-4 h-4"
                    />
                  </td>

                  {/* Year */}
                  <td className="p-3 font-semibold">{row.year}</td>

                  {/* Heatmap Values */}
                  {row.values.map((val, i) => (
                    <td
                      key={i}
                      className={`p-2 text-center font-medium rounded-sm ${heatmapColor(
                        val
                      )}`}
                    >
                      {formatPercentage(val)}
                    </td>
                  ))}

                  {/* Average */}
                  <td className="p-2 text-center font-semibold">
                    {formatPercentage(avg)}
                  </td>
                </tr>
              );
            })}

            {/* Column averages row */}
            <tr className="bg-[var(--bg-soft)] font-bold border-t border-[var(--card-border)]">
              <td className="p-2 text-center">–</td>
              <td className="p-2">Gemiddelde</td>
              {colAverages.map((val, i) => (
                <td
                  key={i}
                  className={`p-2 text-center font-semibold rounded-sm ${heatmapColor(
                    val
                  )}`}
                >
                  {formatPercentage(val)}
                </td>
              ))}
              <td className="p-2 text-center">–</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ======================================================
         📈 FORWARD RETURN RESULTS (PRO-STIJL)
      ====================================================== */}
      <div className="border-t pt-4 space-y-3">

        <div className="flex items-center gap-2 text-[var(--text-dark)] font-bold text-sm">
          <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
          Forward Return Results (geselecteerde jaren)
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] uppercase text-xs">
              <tr className="border-b border-[var(--card-border)]">
                <th className="p-2 text-left">Stat</th>
                {labels.map((l) => (
                  <th key={l} className="p-2 text-center">{l}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Totals */}
              <tr className="border-b border-[var(--card-border)]">
                <td className="p-2 font-semibold">Aantal</td>
                {forwardStats.map((s, i) => (
                  <td key={i} className="p-2 text-center">
                    {s.total}
                  </td>
                ))}
              </tr>

              {/* Wins */}
              <tr className="border-b border-[var(--card-border)]">
                <td className="p-2 font-semibold">Wins</td>
                {forwardStats.map((s, i) => (
                  <td key={i} className="p-2 text-center text-green-700 font-semibold">
                    {s.wins}
                  </td>
                ))}
              </tr>

              {/* Losses */}
              <tr className="border-b border-[var(--card-border)]">
                <td className="p-2 font-semibold">Losses</td>
                {forwardStats.map((s, i) => (
                  <td key={i} className="p-2 text-center text-red-700 font-semibold">
                    {s.losses}
                  </td>
                ))}
              </tr>

              {/* Returns */}
              <tr>
                <td className="p-2 font-semibold">Winrate</td>
                {forwardStats.map((s, i) => (
                  <td key={i} className="p-2 text-center font-semibold">
                    {s.rate !== null ? `${s.rate.toFixed(1)}%` : "–"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
