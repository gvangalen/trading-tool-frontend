'use client';

import { useState, useEffect } from 'react';

export default function MarketDayTable({ data = [], onRemove }) {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    // Zorg dat we een kopie hebben met IDs
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

  // 🟦 DELETE NU MET ID ipv NAME
  const handleDelete = async (id) => {
    if (!id) return;

    const item = localData.find((x) => x.id === id);
    const label = item?.name || 'indicator';

    if (!window.confirm(`Weet je zeker dat je "${label}" wilt verwijderen?`)) return;

    try {
      await onRemove(id);
      setLocalData(localData.filter((i) => i.id !== id));
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
      alert('❌ Verwijderen mislukt.');
    }
  };

  if (!localData || localData.length === 0) {
    return (
      <>
        <tr>
          <td colSpan={6} className="p-6 text-center text-gray-500">
            ⚠️ Geen actieve market-indicatoren.<br />
            ➕ Voeg er één toe in de ScoreView.
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      {localData.map((item) => (
        <tr key={item.id} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{item.name}</td>
          <td className="p-2 text-center">{formatValue(item.value)}</td>
          <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
            {item.score ?? '–'}
          </td>
          <td className="p-2 text-center">{item.action || '–'}</td>
          <td className="p-2">{item.interpretation || 'Geen uitleg'}</td>

          {/* ❌ DELETE KNOP → werkt nu met ID */}
          <td className="p-2 text-center">
            <button
              onClick={() => handleDelete(item.id)}
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
