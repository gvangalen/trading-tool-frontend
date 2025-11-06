'use client';

import { useEffect, useState } from 'react';
import { deleteMacroIndicator } from '@/lib/api/macro';

export default function MacroDayTable({
  data = [],
  onRemove,
  showDebug = false,
  getExplanation,
}) {
  // ✅ Veilige initiële state
  const [localData, setLocalData] = useState(Array.isArray(data) ? data : []);

  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('❌ Ongeldige macro data ontvangen:', data);
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

  // 🗑️ Verwijder één macro-indicator (zelfde logica als technical)
  const handleDelete = async (name) => {
    if (!name) return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je '${name}' wilt verwijderen?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteMacroIndicator(name);
      console.log('✅ [MacroDayTable] Verwijderd:', res);

      // 🔄 Update lokale staat
      const updated = localData.filter((i) => i.name !== name);
      setLocalData(updated);
      onRemove?.(name);

      // ✅ Visuele feedback (zelfde als bij technical)
      window.alert(`✅ Indicator '${name}' succesvol verwijderd.`);
    } catch (err) {
      console.error('❌ [MacroDayTable] Fout bij verwijderen:', err);
      window.alert(`❌ Verwijderen van '${name}' mislukt.`);
    }
  };

  // 🧠 Geen data fallback (zelfde layout als technical)
  if (!Array.isArray(localData) || localData.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-6 text-center text-gray-500">
          ⚠️ Geen macro-indicatoren actief.<br />
          ➕ Voeg een indicator toe om te beginnen.
        </td>
      </tr>
    );
  }

  return (
    <>
      {/* 📋 Indicator-rijen */}
      {localData.map((item, index) => {
        const {
          name = '–',
          value = '–',
          score = null,
          action = '–',
          interpretation = 'Geen uitleg beschikbaar',
        } = item;

        return (
          <tr key={`macro-${name}-${index}`} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium" title={getExplanation?.(name)}>
              {name}
            </td>
            <td className="p-2 text-center">{value}</td>
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score !== null ? score : '–'}
            </td>
            <td className="p-2 text-center">{action}</td>
            <td className="p-2">{interpretation}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => handleDelete(name)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title={`Verwijder ${name}`}
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
