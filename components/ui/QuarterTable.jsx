"use client";

import dayjs from "dayjs";

/**
 * 📅 QuarterTable
 * Nieuwe uniforme tabel (zoals Day/Week/Month),
 * gegroepeerd per kwartaal: Q1, Q2, Q3, Q4
 */
export default function QuarterTable({ data = [], onRemove }) {
  const groups = groupByQuarter(data);

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-4">
        Geen kwartaaldata beschikbaar.
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="
            bg-white
            border border-[var(--card-border)]
            rounded-xl
            shadow-sm
            overflow-hidden
          "
        >
          {/* KWARTAAL HEADER */}
          <div
            className="
              px-4 py-3
              bg-gray-50
              border-b border-[var(--card-border)]
              font-semibold
              text-[var(--text-dark)]
            "
          >
            📆 {group.label}
          </div>

          {/* TABEL */}
          <table className="w-full text-sm">
            <tbody>
              {group.items.map((item, idx) => (
                <QuarterRow
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
   ROW COMPONENT (identiek aan DayTableRow)
===================================================== */
function QuarterRow({ item, onRemove }) {
  const {
    name = "–",
    value = "–",
    score = null,
    interpretation = "–",
    action = "–",
  } = item;

  const getScoreColor = (score) => {
    const s = typeof score === "number" ? score : Number(score);
    if (isNaN(s)) return "text-gray-500";
    if (s >= 70) return "text-green-600";
    if (s <= 40) return "text-red-500";
    return "text-yellow-600";
  };

  return (
    <tr className="border-t border-[var(--card-border)] hover:bg-gray-50 transition">
      <td className="p-3 font-medium text-[var(--text-dark)]">{name}</td>
      <td className="p-3 text-center text-[var(--text-dark)]">{value}</td>
      <td
        className={`p-3 text-center font-semibold ${getScoreColor(score)}`}
      >
        {score !== null && !isNaN(score) ? Math.round(score) : "–"}
      </td>
      <td className="p-3 text-center italic text-[var(--text-light)]">
        {action}
      </td>
      <td className="p-3 text-center italic text-[var(--text-light)]">
        {interpretation}
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onRemove?.(name)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          title={`Verwijder ${name}`}
        >
          ❌
        </button>
      </td>
    </tr>
  );
}

/* =====================================================
   QUARTER GROUPING (IN DIT BESTAND)
===================================================== */
function groupByQuarter(items) {
  if (!Array.isArray(items)) return [];

  const groups = {};

  items.forEach((item) => {
    const ts = item.timestamp || item.date;
    if (!ts) return;

    const d = dayjs(ts);

    const month = d.month(); // 0–11
    const year = d.year();

    // Bepaal kwartaal
    const quarter = Math.floor(month / 3) + 1; // 1–4

    const key = `${year}-Q${quarter}`;

    if (!groups[key]) {
      groups[key] = {
        label: `Q${quarter} – ${year}`,
        items: [],
      };
    }

    groups[key].items.push(item);
  });

  return Object.values(groups);
}
