'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast'; // ✅ Toasts toegevoegd

export default function MacroDayTable({
  data = [],
  onRemove,          // => verwijdert indicator via hook
  showDebug = false,
  getExplanation,
}) {
  useEffect(() => {
    console.log('📊 [MacroDayTable] received data:', data);
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // 🧠 Geen data fallback
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen macro dagdata beschikbaar.
        </td>
      </tr>
    );
  }

  // 🗑️ Verwijderactie met confirm & toast
  const handleDeleteClick = async (name) => {
    if (!name) return;
    const confirm = window.confirm(`Weet je zeker dat je '${name}' wilt verwijderen?`);
    if (!confirm) {
      toast('❎ Verwijderen geannuleerd');
      return;
    }

    toast.loading(`Verwijderen van '${name}'...`);
    try {
      await onRemove?.(name);
      toast.dismiss();
      toast.success(`✅ '${name}' succesvol verwijderd.`);
    } catch (err) {
      console.error('❌ Fout bij verwijderen:', err);
      toast.dismiss();
      toast.error(`❌ Verwijderen van '${name}' mislukt.`);
    }
  };

  return (
    <>
      {data.map((item, index) => {
        const {
          name = item.indicator || '–',
          waarde = '–',
          score = null,
          advies = item.advies || item.action || '–',
          uitleg = item.uitleg || item.interpretation || 'Geen uitleg beschikbaar',
        } = item;

        return (
          <tr
            key={name || `row-${index}`}
            className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <td className="p-2 font-medium" title={getExplanation?.(name)}>
              {name}
            </td>
            <td className="p-2 text-center">{waarde}</td>
            <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
              {score !== null ? score : '–'}
            </td>
            <td className="p-2 text-center">{advies}</td>
            <td className="p-2">{uitleg}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => handleDeleteClick(name)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                title="Verwijder deze macro-indicator"
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}

      {showDebug && (
        <tr>
          <td colSpan={6}>
            <pre className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-64 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
