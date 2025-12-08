"use client";

import { Info, Trash2 } from "lucide-react";

/**
 * 📅 DayTable — PRO 3.0
 * - Altijd een witte tabel (zoals Market table)
 * - Header: witte achtergrond + dunne border
 * - Fallback: nette witte rij met lichtgrijze tekst
 * - Datakleuren & borders uit globals.css
 */
export default function DayTable({
  title = null,
  icon = null,
  data = [],
  onRemove = null,
}) {
  const hasRemove = typeof onRemove === "function";
  const safeData = Array.isArray(data) ? data : [];

  /** ---------------- HEADER ---------------- */
  const renderHeader = () => (
    <thead className="bg-white text-[var(--text-light)] text-xs uppercase">
      <tr className="border-b border-[var(--card-border)]">
        <th className="px-4 py-3 text-left font-semibold flex items-center gap-2 text-[var(--text-dark)]">
          <Info className="w-4 h-4 text-[var(--text-light)]" /> Indicator
        </th>
        <th className="px-4 py-3 text-center font-semibold text-[var(--text-dark)]">Waarde</th>
        <th className="px-4 py-3 text-center font-semibold text-[var(--text-dark)]">Score</th>
        <th className="px-4 py-3 text-center font-semibold text-[var(--text-dark)]">Advies</th>
        <th className="px-4 py-3 text-left font-semibold text-[var(--text-dark)]">Uitleg</th>

        {hasRemove && (
          <th className="px-4 py-3 text-center font-semibold text-[var(--text-dark)]">Actie</th>
        )}
      </tr>
    </thead>
  );

  return (
    <div className="bg-white border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden">
      {/* ---------------- TITLE BAR ---------------- */}
      {title && (
        <div className="px-4 py-3 bg-white border-b border-[var(--card-border)] font-semibold text-[var(--text-dark)] flex items-center gap-2">
          {icon} {title}
        </div>
      )}

      {/* ---------------- TABLE ---------------- */}
      <table className="w-full text-sm bg-white">
        {renderHeader()}

        <tbody>
          {/* ---------------- FALLBACK (geen data) ---------------- */}
          {safeData.length === 0 && (
            <tr className="border-t border-[var(--card-border)]">
              <td
                colSpan={hasRemove ? 6 : 5}
                className="px-4 py-4 text-center italic text-[var(--text-light)] bg-white"
              >
                Nog geen data beschikbaar.
              </td>
            </tr>
          )}

          {/* ---------------- DATA ROWS ---------------- */}
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
