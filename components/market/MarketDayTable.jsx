"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

export default function MarketDayTable({ data = [], onRemove }) {
  const [localData, setLocalData] = useState([]);
  const { openConfirm, showSnackbar } = useModal();

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
     ❌ VERWIJDEREN — ZELFDE MODAL ALS MACRO / TECHNICAL
  ------------------------------------------------------- */
  const handleDelete = (name) => {
    if (!name) return;

    openConfirm({
      title: "Market-indicator verwijderen",
      description: `Weet je zeker dat je '${name}' wilt verwijderen?`,
      tone: "danger",
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      onConfirm: async () => {
        try {
          await onRemove(name); // parent hook regelt refresh
          showSnackbar("Market-indicator verwijderd ✔️", "success");
        } catch (err) {
          console.error("❌ Verwijderen mislukt:", err);
          showSnackbar("Verwijderen mislukt", "danger");
        }
      },
    });
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
        <tr key={item.name} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{item.name}</td>

          <td className="p-2 text-center">
            {formatValue(item.value)}
          </td>

          <td
            className={`p-2 text-center font-bold ${getScoreColor(
              item.score
            )}`}
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
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
