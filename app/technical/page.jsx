'use client';

import { useState } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useScoresData } from '@/hooks/useScoresData';

import TechnicalTabs from '@/components/technical/TechnicalTabs';
import IndicatorScoreView from '@/components/technical/IndicatorScoreView';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    handleRemove,
    loading: loadingIndicators,
    error,

    // 🔥 Deze 4 komen uit de hook — nodig voor de dropdown
    indicatorNames,
    scoreRules,
    loadScoreRules,
    addTechnicalData,

  } = useTechnicalData(activeTab);

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

  // 🔥 Selected indicator: simpele local state
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  // Wanneer user iets selecteert in de dropdown:
  const handleSelectIndicator = (item) => {
    setSelectedIndicator(item);
    loadScoreRules(item.name); // ⬅️ laad scoreregels uit de DB
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Technische Analyse</h1>

      {/* 📊 Score + advies */}
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

      {/* 🔍 Scorelogica bekijken — NU MET JUISTE PROPS */}
      <IndicatorScoreView
        indicatorNames={indicatorNames}              // ⬅️ lijst voor zoek dropdown
        selectedIndicator={selectedIndicator}        // ⬅️ wat is geselecteerd
        onSelectIndicator={handleSelectIndicator}    // ⬅️ laad regels
        scoreRules={scoreRules}                      // ⬅️ regels uit DB
        addTechnicalData={addTechnicalData}          // ⬅️ toevoegen aan dagtabel
      />

      {/* 📅 Tabs met technische indicatoren per periode */}
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
