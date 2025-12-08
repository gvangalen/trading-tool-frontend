"use client";

import { Info, Trash2 } from "lucide-react";

/**
 * 📅 DayTable — PRO 2.6 (Matcht Market Table Styling)
 * - Altijd tabel + header
 * - Header heeft soft background zoals Market
 * - Lege fallback-rij bij 0 items
 */
export default function DayTable({
  title = null,
  icon = null,
  data = [],
  onRemove = null,
}) {
  const hasRemove = typeof onRemove === "function";

  const safeData = Array.isArray(data) ? data : [];

  /* ---------------- HEADER ---------------- */
  const renderHeader = () => (
    <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
      <tr className="border-b border-[var(--card-border)]">
        <th className="px-4 py-3 text-left font-semibold flex items-center gap-2">
          <Info className="w-4 h-4" /> Indicator
        </th>
        <th className="px-4 py-3 text-center font-semibold">Waarde</th>
        <th className="px-4 py-3 text-center font-semibold">Score</th>
        <th className="px-4 py-3 text-center font-semibold">Advies</th>
        <th className="px-4 py-3 text-left font-semibold">Uitleg</th>

        {hasRemove && (
          <th className="px-4 py-3 text-center font-semibold">Actie</th>
        )}
      </tr>
    </thead>
  );

  return (
    <div className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden">
      {/* Titelbalk */}
      {title && (
        <div className="px-4 py-3 bg-[var(--bg-soft)] border-b font-semibold text-[var(--text-dark)] flex items-center gap-2">
          {icon} {title}
        </div>
      )}

      <table className="w-full text-sm">
        {renderHeader()}

        <tbody>
          {/* Fallback row when empty */}
          {safeData.length === 0 && (
            <tr className="border-t border-[var(--card-border)]">
              <td
                colSpan={hasRemove ? 6 : 5}
                className="px-4 py-4 text-center italic text-[var(--text-light)]"
              >
                Nog geen data beschikbaar.
              </td>
            </tr>
          )}

          {/* Normal rows */}
          {safeData.map((item, idx) => (
            <DayRow key={idx} item={item} onRemove={onRemove} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================
   ROW COMPONENT
===================================================== */
function DayRow({ item, onRemove }) {
  const { name, indicator, value = "–", score, action, interpretation } = item;

  const displayName = name || indicator || "–";

  const getScoreColor = (num) => {
    const n = Number(num);
    if (isNaN(n)) return "text-[var(--text-light)]";

    if (n >= 80) return "score-strong-buy";
    if (n >= 60) return "score-buy";
    if (n >= 40) return "score-neutral";
    if (n >= 20) return "score-sell";
    return "score-strong-sell";
  };

  return (
    <tr className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition">
      <td className="px-4 py-3 font-medium text-[var(--text-dark)] whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--text-light)]" />
          {displayName}
        </div>
      </td>

      <td className="px-4 py-3 text-center">{value}</td>

      <td className={`px-4 py-3 text-center font-semibold ${getScoreColor(score)}`}>
        {score ?? "–"}
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
            onClick={() => onRemove(displayName)}
            className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
}
