'use client';

import { useState } from 'react';
import MacroTabs from '@/components/macro/MacroTabs';
import CardWrapper from '@/components/ui/CardWrapper';
import { useScoresData } from '@/hooks/useScoresData'; // ✅ Hook importeren

export default function MacroPage() {
  const [editIndicator, setEditIndicator] = useState(null);

  // ✅ Haal macro-score en uitleg uit de hook
  const { macro, loading } = useScoresData();

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score <= 25) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">🌍 Macro Indicatoren</h1>

      {/* ✅ Samenvatting */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            🌍 Macro Score:{' '}
            <span className={scoreColor(macro?.score)}>
              {loading ? '⏳' : macro?.score ?? '–'}
            </span>
          </h3>
          <h3 className="text-lg font-semibold">
            📈 Uitleg:{' '}
            <span className="text-gray-600 italic">
              {macro?.interpretation || 'Geen uitleg beschikbaar'}
            </span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Macro Tabs */}
      <MacroTabs />

      {/* 💬 Popup voor bewerken */}
      {editIndicator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-bold">✏️ Bewerk {editIndicator.name}</h3>
            <button
              onClick={() => setEditIndicator(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
