'use client';

import { useState } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useScoresData } from '@/hooks/useScoresData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('Dag');

  // 🔹 Data voor de tabellen
  const {
    technicalData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useTechnicalData(activeTab);

  // 🔹 Score en advies uit centrale hook
  const { technical, loading: loadingScore } = useScoresData();

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  const adviesText =
    technical.score >= 75
      ? '📈 Bullish'
      : technical.score <= 25
      ? '📉 Bearish'
      : '⚖️ Neutraal';

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">📊 Technische Analyse</h1>

      {/* ✅ Technische Score */}
      <CardWrapper>
        <p className="text-lg font-semibold">
          🧮 Totale Technische Score:{' '}
          <span className={getScoreColor(technical.score)}>
            {loadingScore ? '⏳' : technical.score ?? '–'}
          </span>
        </p>
        <p className="text-lg">
          🧠 Advies:{' '}
          <span className="text-blue-600">
            {loadingScore ? '⏳' : adviesText}
          </span>
        </p>
      </CardWrapper>

      {/* 🔹 Tabs + Tabel */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />
    </div>
  );
}
