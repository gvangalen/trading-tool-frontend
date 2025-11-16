'use client';

import { useState, useEffect } from 'react';

export default function MarketDayTable({ data = [], onRemove }) {
  const [localData, setLocalData] = useState([]);

  // Sync met parent
  useEffect(() => {
    setLocalData(Array.isArray(data) ? data : []);
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = Number(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 75) return 'text-green-600';
    if (s <= 25) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🔢 Waarde formatter
  const formatValue = (val) => {
    if (val === null || val === undefined) return '–';
    const n = Number(val);
    if (isNaN(n)) return val;
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // 🗑️ Verwijderen op basis van indicator NAME
  const handleDelete = async (name) => {
    if (!name) return;

    const sure = window.confirm(
      `Weet je zeker dat je "${name}" wilt verwijderen uit de dagelijkse analyse?`
    );
    if (!sure) return;

    try {
      await onRemove(name);     // ⬅ Hook regelt backend DELETE
      setLocalData(localData.filter((i) => i.name !== name));
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
      alert('❌ Verwijderen mislukt. Check console.');
    }
  };

  // 🧠 Geen data fallback
  if (!localData || localData.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-6 text-center text-gray-500">
          ⚠️ Geen actieve market-indicatoren.<br />
          ➕ Voeg er één toe in de ScoreView.
        </td>
      </tr>
    );
  }

  // 📋 Tabellenrijen renderen
  return (
    <>
      {localData.map((item) => (
        <tr
          key={item.name}
          className="border-t dark:border-gray-700"
        >
          {/* 🔸 Naam */}
          <td className="p-2 font-medium">{item.name}</td>

          {/* 🔸 Value */}
          <td className="p-2 text-center">{formatValue(item.value)}</td>

          {/* 🔸 Score */}
          <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
            {item.score ?? '–'}
          </td>

          {/* 🔸 Actie */}
          <td className="p-2 text-center">{item.action || '–'}</td>

          {/* 🔸 Uitleg */}
          <td className="p-2">{item.interpretation || 'Geen uitleg'}</td>

          {/* 🗑 Delete */}
          <td className="p-2 text-center">
            <button
              onClick={() => handleDelete(item.name)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
