"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function MarketDayTable({ data = [], onRemove }) {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(Array.isArray(data) ? data : []);
  }, [data]);

  const getScoreColor = (score) => {
    const s = Number(score);
    if (isNaN(s)) return "text-gray-600";
    if (s >= 75) return "text-green-600";
    if (s <= 25) return "text-red-600";
    return "text-yellow-600";
  };

  const formatValue = (val) => {
    if (val === null || val === undefined) return "–";
    const n = Number(val);
    return isNaN(n)
      ? val
      : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  /* -------------------------------------------------------
     ❌ DELETE → alleen callback (zoals Macro & Technical)
  ------------------------------------------------------- */
  const handleDelete = (name) => {
    if (!name || !onRemove) return;
    onRemove(name); // 👉 confirm + snackbar zitten in hook
  };

  if (!localData || localData.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-6 text-center text-gray-500">
          ⚠️ Geen actieve market-indicatoren.
          <br />
          ➕ Voeg er één toe in de ScoreView.
        </td>
      </tr>
    );
  }

  return (
    <>
      {localData.map((item) => (
        <tr
          key={item.name}
          className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition"
        >
          <td className="p-2 font-medium">{item.name}</td>

          <td className="p-2 text-center">
            {formatValue(item.value)}
          </td>

          <td
            className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}
          >
            {item.score ?? "–"}
          </td>

          <td className="p-2 text-center">
            {item.action || "–"}
          </td>

          <td className="p-2">
            {item.interpretation || "Geen uitleg"}
          </td>

          {/* ❌ DELETE */}
          <td className="p-2 text-center">
            <button
              onClick={() => handleDelete(item.name)}
              className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600 transition"
              title="Verwijder indicator"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
