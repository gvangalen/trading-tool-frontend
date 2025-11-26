"use client";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

import DayTableRow from "./DayTableRow";

/**
 * 📅 WeekTable
 * Zelfstandige versie van de nieuwe DayTable,
 * maar gegroepeerd per week (Week 43 – 2025)
 */

export default function WeekTable({ data = [], onRemove }) {
  // ---------------------------------------
  // 1) GROEPEREN PER WEEK (direct in dit bestand)
  // ---------------------------------------
  const groups = groupByWeek(data);

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-4">
        Geen weekdata beschikbaar.
      </div>
    );
  }

  // ---------------------------------------
  // 2) WEERGAVE — zelfde stijl als DayTable
  // ---------------------------------------
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
          {/* WEEK HEADER */}
          <div
            className="
              px-4 py-3
              bg-gray-50
              border-b border-[var(--card-border)]
              font-semibold
              text-[var(--text-dark)]
            "
          >
            📅 {group.label}
          </div>

          {/* TABEL */}
          <table className="w-full text-sm">
            <tbody>
              {group.items.map((item, idx) => (
                <DayTableRow
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

/* ============================================================
   🧠 FUNCTIE: Week-groepering (IN FILE, geen utils-file nodig)
=============================================================== */
function groupByWeek(items) {
  if (!Array.isArray(items)) return [];

  const groups = {};

  items.forEach((item) => {
    const ts = item.timestamp || item.date;
    if (!ts) return;

    const d = dayjs(ts);
    const year = d.year();
    const week = d.week();
    const key = `${year}-W${week}`;

    if (!groups[key]) {
      groups[key] = {
        label: `Week ${week} – ${year}`,
        items: [],
      };
    }

    groups[key].items.push(item);
  });

  return Object.values(groups);
}
