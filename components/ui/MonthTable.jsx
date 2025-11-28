"use client";

import { Info, Trash2 } from "lucide-react";
import dayjs from "dayjs";

/**
 * 📅 MonthTable — PRO Style 2.2
 * Zelfde look & feel als DayTable en WeekTable, gegroepeerd per maand.
 */
export default function MonthTable({ data = [], onRemove }) {
  const groups = groupByMonth(data);

  const renderHeader = () => (
    <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
      <tr className="border-b border-[var(--card-border)]">
        <th className="px-4 py-3 text-left font-semibold flex items-center gap-2">
          <Info className="w-4 h-4" />
          Indicator
        </th>
        <th className="px-4 py-3 text-center font-semibold">Waarde</th>
        <th className="px-4 py-3 text-center font-semibold">Score</th>
        <th className="px-4 py-3 text-center font-semibold">Advies</th>
        <th className="px-4 py-3 text-left font-semibold">Uitleg</th>
        {onRemove && (
          <th className="px-4 py-3 text-center font-semibold">Actie</th>
        )}
      </tr>
    </thead>
  );

  // ❌ Geen maandgroepen → lege staat
  if (!groups || groups.length === 0) {
    const colSpan = onRemove ? 6 : 5;

    return (
      <div className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-[var(--card-border)] font-semibold text-[var(--text-dark)]">
          📆 Maanddata
        </div>
        <table className="w-full text-sm">
          {renderHeader()}
          <tbody>
            <tr>
              <td
                colSpan={colSpan}
                className="px-4 py-6 text-center text-[var(--text-light)] italic"
              >
                Geen maanddata beschikbaar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ✅ Met groepen — toon PRO-kaarten onder elkaar
  return (
    <div className="space-y-8 w-full">
      {groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden"
        >
          {/* Label bar */}
          <div className="px-4 py-3 bg-gray-50 border-b border-[var(--card-border)] font-semibold text-[var(--text-dark)]">
            📆 {group.label}
          </div>

          {/* Tabel */}
          <table className="w-full text-sm">
            {renderHeader()}
            <tbody>
              {group.items.map((item, idx) => (
                <MonthRow
                  key={`${gIdx}-${idx}`}
                  item={item}
                  onRemove={onRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   ROW COMPONENT — PRO Style
===================================================== */
function MonthRow({ item, onRemove }) {
  const {
    name = "–",
    indicator,
    value = "–",
    score = null,
    interpretation = "–",
    action = "–",
  } = item;

  const displayName = name || indicator || "–";

  const getScoreColor = (score) => {
    const n = typeof score === "number" ? score : Number(score);
    if (isNaN(n)) return "text-[var(--text-light)]";

    if (n >= 80) return "score-strong-buy";
    if (n >= 60) return "score-buy";
    if (n >= 40) return "score-neutral";
    if (n >= 20) return "score-sell";
    return "score-strong-sell";
  };

  const displayScore =
    score !== null && !isNaN(Number(score))
      ? Math.round(Number(score))
      : "–";

  return (
    <tr className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition">
      <td className="px-4 py-3 font-medium text-[var(--text-dark)] whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--text-light)]" />
          {displayName}
        </div>
      </td>

      <td className="px-4 py-3 text-center text-[var(--text-dark)]">
        {value}
      </td>

      <td
        className={`px-4 py-3 text-center font-semibold ${getScoreColor(
          score
        )}`}
      >
        {displayScore}
      </td>

      <td className="px-4 py-3 text-center italic text-[var(--text-light)]">
        {action || "–"}
      </td>

      <td className="px-4 py-3 text-[var(--text-light)]">
        {interpretation || "–"}
      </td>

      {onRemove && (
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => onRemove?.(displayName)}
            className="inline-flex items-center justify-center p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            title={`Verwijder ${displayName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
}

/* =====================================================
   MONTH GROUPING — PRO versie
===================================================== */
function groupByMonth(items) {
  if (!Array.isArray(items)) return [];

  const groups = {};

  items.forEach((item) => {
    const ts = item.timestamp || item.date;
    if (!ts) return;

    const d = dayjs(ts);
    const monthName = d.format("MMMM");
    const year = d.year();
    const key = `${year}-${d.month()}`;

    if (!groups[key]) {
      groups[key] = {
        label: `${monthName} – ${year}`,
        items: [],
      };
    }

    groups[key].items.push(item);
  });

  return Object.values(groups);
}
