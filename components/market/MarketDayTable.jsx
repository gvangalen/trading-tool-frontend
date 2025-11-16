'use client';

import { useEffect, useState } from 'react';
import { deleteMarketAsset } from '@/lib/api/market'; // ⬅ juiste delete route

export default function MarketDayTable({
  data = [],
  onRemove,
  showDebug = false,
  getExplanation,
}) {
  // Lokale state voor tabeldata
  const [localData, setLocalData] = useState(Array.isArray(data) ? data : []);

  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('❌ Ongeldige market data ontvangen:', data);
      setLocalData([]);
    } else {
      setLocalData(data);
    }
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🔢 Waarde formatter
  const formatValue = (val) => {
    if (val === null || val === undefined || val === '–') return '–';
    const n = typeof val === 'number' ? val : parseFloat(val);
    if (Number.isNaN(n)) return val;
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // 🗑️ Verwijderen van een market indicator
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je deze market indicator wilt verwijderen?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteMarketAsset(id);
      console.log('✅ [MarketDayTable] Verwijderd:', res);

      const updated = localData.filter((i) => i.id !== id);
      setLocalData(updated);
      onRemove?.(id);

      window.alert(`✅ Indicator succesvol verwijderd.`);
    } catch (err) {
      console.error('❌ [MarketDayTable] Fout bij verwijderen:', err);
      window.alert(`❌ Verwijderen mislukt.`);
    }
  };

  // 🧠 Geen data fallback
  if (!Array.isArray(localData) || localData.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-6 text-center text-gray-500">
          ⚠️ Geen market-indicatoren actief.<br />
          ➕ Voeg een indicator toe om te beginnen.
        </td>
      </tr>
    );
  }

  // 📋 Render rows
  return (
    <>
      {localData.map((item, index) => {
        const {
          id,
          name = item.indicator ?? '–',
          display_name,
          value = item.value ?? item.waarde ?? '–',
          score = item.score ?? null,
          advice = item.advice ?? item.advies ?? '–',
          interpretation =
            item.interpretation ??
            item.uitleg ??
            item.explanation ??
            'Geen uitleg beschikbaar',
        } = item;

        const shownName = display_name || name;

        return (
          <tr key={`market-${id}-${index}`} className="border-t dark:border-gray-700">
            {/* Naam */}
            <td className="p-2 font-medium" title={getExplanation?.(name)}>
              {shownName}
            </td>

            {/* Waarde */}
            <td className="p-2 text-center">{formatValue(value)}</td>

            {/* Score */}
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score ?? '–'}
            </td>

            {/* Advies */}
            <td className="p-2 text-center">{advice || '–'}</td>

            {/* Uitleg */}
            <td className="p-2">{interpretation}</td>

            {/* Delete */}
            <td className="p-2 text-center">
              <button
                onClick={() => handleDelete(id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title={`Verwijder ${shownName}`}
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}

      {/* Debug */}
      {showDebug && (
        <tr>
          <td colSpan={6}>
            <pre className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-64 overflow-auto">
              {JSON.stringify(localData, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
