"use client";

import { Trash } from "lucide-react";
import dayjs from "dayjs";

/* ===========================================================
   🧠 INLINE GROEPING LOGICA (GEEN extra file)
   - Groepeert alle rows per weeknummer + jaar
   - Maakt labels zoals: "Week 43 – 2025"
=========================================================== */
function groupByWeek(data = []) {
  if (!Array.isArray(data)) return [];

  const buckets = {};

  for (const item of data) {
    const ts = item.timestamp || item.date || item.created_at;
    if (!ts) continue;

    const d = dayjs(ts);
    const week = d.week?.() ?? d.isoWeek?.() ?? d.weekNumber?.() ?? 0;
    const year = d.year();

    const key = `${year}-W${week}`;

    if (!buckets[key]) {
      buckets[key] = {
        label: `📅 Week ${week} – ${year}`,
        items: [],
      };
    }
    buckets[key].items.push(item);
  }

  return Object.values(buckets).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

/* ===========================================================
   📅 WEEK TABLE COMPONENT
=========================================================== */
export default function WeekTable({
  title,
  icon,
  data = [],
  loading,
  error,
  onRemove,
}) {
  const grouped = groupByWeek(data);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        Data laden…
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Fout: {error}</div>;
  }

  if (!grouped || grouped.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic">
        ⚠️ Geen weekdata beschikbaar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Titel */}
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-[var(--text-dark)]">{title}</h2>
      </div>

      {/* Tabel */}
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
            {grouped.map((week, wkIndex) => (
              <>
                {/* WEEK HEADER */}
                <tr
                  key={`w-${wkIndex}`}
                  className="bg-gray-100 border-t border-gray-300"
                >
                  <td colSpan={6} className="p-3 font-semibold">
                    {week.label}
                  </td>
                </tr>

                {/* ROWS */}
                {week.items.map((item, i) => (
                  <tr
                    key={`${week.label}-${item.name}-${i}`}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-center">{item.value ?? "–"}</td>
                    <td className="p-3 text-center font-semibold">
                      {item.score ?? "–"}
                    </td>
                    <td className="p-3 text-center italic text-gray-600">
                      {item.action ?? "–"}
                    </td>
                    <td className="p-3 text-center italic text-gray-500">
                      {item.interpretation ?? "–"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onRemove?.(item.name)}
                        className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
