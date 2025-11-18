'use client';

import { useState } from 'react';

import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useScoresData } from '@/hooks/useScoresData';

import TechnicalTabs from '@/components/technical/TechnicalTabs';
import TechnicalIndicatorScoreView from '@/components/technical/IndicatorScoreView';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('Dag');
  const [editIndicator, setEditIndicator] = useState(null);

  // 📡 Haal technische data + remove functie op
  const {
    technicalData,
    removeTechnicalIndicator,   // <-- juiste functie
    loading: loadingIndicators,
    error,
  } = useTechnicalData(activeTab);

  // 📊 Haal technische score uit algemene score-API
  const { technical, loading: loadingScore } = useScoresData();

  // 🎨 Kleurcodering
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  // Advies bepalen uit score
  const adviesText =
    (technical?.score ?? 0) >= 75
      ? '📈 Bullish'
      : (technical?.score ?? 0) <= 25
      ? '📉 Bearish'
      : '⚖️ Neutraal';

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">📐 Technische Analyse</h1>

      {/* ✅ Samenvatting */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            🧮 Totale Technische Score:{' '}
            <span className={getScoreColor(technical?.score)}>
              {loadingScore ? '⏳' : technical?.score ?? '–'}
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
      <TechnicalIndicatorScoreView />

      {/* 📅 Tabs met data */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loadingIndicators}
        error={error}
        handleRemove={removeTechnicalIndicator}   // <-- FIXED
      />

      {/* 💬 Popup (optioneel) */}
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
