'use client';

import { useEffect, useState } from 'react';
import { deleteTechnicalIndicator } from '@/lib/api/technical';

export default function TechnicalDayTable({
  data = [],
  onRemove,
  showDebug = false,
}) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🗑️ Verwijder één indicator (met bevestiging)
  const handleDelete = async (indicator) => {
    if (!indicator) return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je '${indicator}' wilt verwijderen?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteTechnicalIndicator(indicator);
      console.log('✅ [TechnicalDayTable] Verwijderd:', res);

      // 🔄 Update lokale staat
      const updated = localData.filter((i) => i.indicator !== indicator);
      setLocalData(updated);
      onRemove?.(indicator);

      // ✅ Visuele melding
      window.alert(`✅ Indicator '${indicator}' succesvol verwijderd.`);

    } catch (err) {
      console.error('❌ [TechnicalDayTable] Fout bij verwijderen:', err);
      window.alert(`❌ Verwijderen van '${indicator}' mislukt.`);
    }
  };

  // 🧠 Geen data fallback (live na verwijderen)
  if (!Array.isArray(localData) || localData.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-6 text-center text-gray-500">
          ⚠️ Geen technische indicatoren actief.<br />
          ➕ Voeg een indicator toe om te beginnen.
        </td>
      </tr>
    );
  }

  return (
    <>
      {localData.map((item, index) => {
        const {
          indicator = '–',
          waarde = '–',
          score = null,
          advies = '–',
          uitleg = '–',
        } = item;

        return (
          <tr key={`indicator-${indicator}-${index}`} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{indicator}</td>
            <td className="p-2 text-center">{waarde}</td>
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score !== null ? score : '–'}
            </td>
            <td className="p-2 text-center">{advies}</td>
            <td className="p-2">{uitleg}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => handleDelete(indicator)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title={`Verwijder ${indicator}`}
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}

      {/* 🧪 Debugmodus */}
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
