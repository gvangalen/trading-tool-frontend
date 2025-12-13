'use client';

import { useEffect, useState } from 'react';

export default function MarketDayTable({ data = [], onRemove }) {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(Array.isArray(data) ? data : []);
  }, [data]);

  const getScoreColor = (score) => {
    const s = Number(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 75) return 'text-green-600';
    if (s <= 25) return 'text-red-600';
    return 'text-yellow-600';
  };

  const formatValue = (val) => {
    if (val === null || val === undefined) return '–';
    const n = Number(val);
    return isNaN(n)
      ? val
      : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // ❌ DELETE OP BASIS VAN NAAM (CORRECT)
  const handleDelete = async (name) => {
    if (!name) return;

    if (!window.confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
      return;
    }

    try {
      await onRemove(name);
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
      alert('❌ Verwijderen mislukt.');
    }
  };

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

  return (
    <>
      {localData.map((item) => (
        <tr key={item.name} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{item.name}</td>

          <td className="p-2 text-center">
            {formatValue(item.value)}
          </td>

          <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
            {item.score ?? '–'}
          </td>

          <td className="p-2 text-center">
            {item.action || '–'}
          </td>

          <td className="p-2">
            {item.interpretation || 'Geen uitleg'}
          </td>

          {/* ❌ DELETE KNOP → NAAM */}
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
