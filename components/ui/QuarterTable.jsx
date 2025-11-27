"use client";

import dayjs from "dayjs";

/**
 * 📅 QuarterTable
 * Zelfde stijl als DayTable, gegroepeerd per kwartaal (Q1–Q4).
 */
export default function QuarterTable({ data = [], onRemove }) {
  const groups = groupByQuarter(data);

  const renderHeader = () => (
    <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
      <tr className="border-b border-[var(--card-border)]">
        <th className="px-4 py-3 text-left font-semibold">Indicator</th>
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

  if (!groups || groups.length === 0) {
    const colSpan = onRemove ? 6 : 5;

    return (
      <div className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-[var(--card-border)] font-semibold text-[var(--text-dark)]">
          📆 Kwartaaldata
        </div>
        <table className="w-full text-sm">
          {renderHeader()}
          <tbody>
            <tr>
              <td
                colSpan={colSpan}
                className="px-4 py-6 text-center text-[var(--text-light)] italic"
              >
                Geen kwartaaldata beschikbaar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-4 py-3 bg-gray-50 border-b border-[var(--card-border)] font-semibold text-[var(--text-dark)]">
            📆 {group.label}
          </div>

          <table className="w-full text-sm">
            {renderHeader()}
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

function QuarterRow({ item, onRemove }) {
  const {
    name = "–",
    indicator,
    value = "–",
    score = null,
    interpretation = "–",
    action = "–",
  } = item;

  const displayName = name || indicator || "–";

  const getScoreColor = (s) => {
    const n = typeof s === "number" ? s : Number(s);
    if (isNaN(n)) return "text-[var(--text-light)]";
    if (n >= 75) return "text-green-600";
    if (n >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const displayScore =
    score !== null && !isNaN(Number(score)) ? Math.round(Number(score)) : "–";

  return (
    <tr className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition">
      <td className="p-3 font-medium text-[var(--text-dark)] whitespace-nowrap">
        {displayName}
      </td>
      <td className="p-3 text-center text-[var(--text-dark)]">{value}</td>
      <td
        className={`p-3 text-center font-semibold ${getScoreColor(score)}`}
      >
        {displayScore}
      </td>
      <td className="p-3 text-center italic text-[var(--text-light)]">
        {action || "–"}
      </td>
      <td className="p-3 text-center italic text-[var(--text-light)]">
        {interpretation || "–"}
      </td>
      {onRemove && (
        <td className="p-3 text-center">
          <button
            onClick={() => onRemove?.(displayName)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            title={`Verwijder ${displayName}`}
          >
            ❌
          </button>
        </td>
      )}
    </tr>
  );
}

/* QUARTER GROUPING (in dit bestand) */
function groupByQuarter(items) {
  if (!Array.isArray(items)) return [];

  const groups = {};

  items.forEach((item) => {
    const ts = item.timestamp || item.date;
    if (!ts) return;

    const d = dayjs(ts);
    const month = d.month(); // 0–11
    const year = d.year();
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
