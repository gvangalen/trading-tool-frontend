'use client';

import { useState } from 'react';
import { useMacroData } from '@/hooks/useMacroData';
import { useScoresData } from '@/hooks/useScoresData';
import MacroTabs from '@/components/macro/MacroTabs';
import MacroIndicatorScoreView from '@/components/macro/MacroIndicatorScoreView';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState('Dag');
  const [editIndicator, setEditIndicator] = useState(null);

  // 📡 Haal macrodata + handleRemove, loading, error op
  const {
    macroData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useMacroData(activeTab);

  // 📊 Haal macro-score uit algemene score-API
  const { macro, loading: loadingScore } = useScoresData();

  // 🎨 Kleurcodering
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  const adviesText =
    (macro?.score ?? 0) >= 75
      ? '📈 Positief'
      : (macro?.score ?? 0) <= 25
      ? '📉 Negatief'
      : '⚖️ Neutraal';

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">🌍 Macro Analyse</h1>

      {/* ✅ Samenvatting */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            🧮 Totale Macro Score:{' '}
            <span className={getScoreColor(macro?.score)}>
              {loadingScore ? '⏳' : macro?.score ?? '–'}
            </span>
          </h3>
          <h3 className="text-lg font-semibold">
            🧠 Advies:{' '}
            <span className="text-blue-600">
              {loadingScore ? '⏳' : adviesText}
            </span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔍 Scorelogica bekijken + indicator toevoegen */}
      <MacroIndicatorScoreView />

      {/* 📅 Tabs met macro-indicatoren per periode */}
      <MacroTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroData={macroData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />

      {/* 💬 Popup (edit placeholder behouden) */}
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
