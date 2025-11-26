"use client";

import { Trash } from "lucide-react";
import dayjs from "dayjs";

/* =====================================================
   🔢 QUARTER GROUPING INLINE
   - Groepeert items per kwartaal (Q1–Q4) per jaar
   - Label: "Q1 – 2025", "Q2 – 2025", etc.
===================================================== */
function groupByQuarter(items = []) {
  if (!Array.isArray(items)) return [];

  const groups = {};

  for (const item of items) {
    const ts = item.timestamp || item.date || item.created_at;
    if (!ts) continue;

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
  }

  // optioneel sorteren op jaar/kwartaal (alfabetisch is hier prima)
  return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
}

/* =====================================================
   🎨 SCORE KLEUR
===================================================== */
function getScoreColor(score) {
  const s = typeof score === "number" ? score : Number(score);
  if (isNaN(s)) return "text-gray-500";
  if (s >= 70) return "text-green-600";
  if (s <= 40) return "text-red-500";
  return "text-yellow-600";
}

/* =====================================================
   📅 QUARTER TABLE COMPONENT
===================================================== */
export default function QuarterTable({
  title,
  icon,
  data = [],
  loading,
  error,
  onRemove,
}) {
  const groups = groupByQuarter(data);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        Data laden…
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">Fout: {error}</div>;
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        ⚠️ Geen kwartaaldata beschikbaar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Titel boven de tabel */}
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-[var(--text-dark)]">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--card-border)] bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-sm text-gray-800">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Indicator</th>
              <th className="p-3 text-center">Waarde</th>
              <th className="p-3 text-center">Score</th>
              <th className="p-3 text-center">Advies</th>
              <th className="p-3 text-center">Uitleg</th>
              <th className="p-3 text-center">–</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((group, gIdx) => (
              <>
                {/* Kwartaal-header */}
                <tr
                  key={`q-header-${gIdx}`}
                  className="bg-gray-100 border-t border-gray-300"
                >
                  <td colSpan={6} className="p-3 font-semibold">
                    📆 {group.label}
                  </td>
                </tr>

                {/* Rijen binnen dit kwartaal */}
                {group.items.map((item, idx) => {
                  const {
                    name = "–",
                    value = "–",
                    score = null,
                    interpretation = "–",
                    action = "–",
                  } = item;

                  return (
                    <tr
                      key={`${group.label}-${name}-${idx}`}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium text-[var(--text-dark)]">
                        {name}
                      </td>
                      <td className="p-3 text-center text-[var(--text-dark)]">
                        {value}
                      </td>
                      <td
                        className={`p-3 text-center font-semibold ${getScoreColor(
                          score
                        )}`}
                      >
                        {score !== null && !isNaN(score)
                          ? Math.round(score)
                          : "–"}
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
                          className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                          title={`Verwijder ${name}`}
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
