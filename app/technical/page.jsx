'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  // ✅ 1. Mapping tab-namen naar backend timeframes
  const [activeTab, setActiveTab] = useState('Dag');
  const tabToTimeframe = {
    Dag: '1D',
    Week: '1W',
    Maand: '1M',
    Kwartaal: '1Q',
  };
  const timeframe = tabToTimeframe[activeTab] || '1D';

  // ✅ 2. Data ophalen via hook
  const {
    avgScore = 'N/A',
    advies = 'Neutraal',
    technicalData = [],
    loading,
    error,
    deleteAsset,
  } = useTechnicalData(timeframe);

  useEffect(() => {
    console.log(`🔁 Opgehaald voor timeframe: ${timeframe}`);
    console.log('📊 Technical data:', technicalData);
  }, [technicalData, timeframe]);

  // ✅ 3. Scorekleur
  const scoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 1.5) return 'text-green-600';
    if (s <= -1.5) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">🧪 Technische Analyse</h1>

      {/* 🔹 Samenvatting */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            📊 Technische Score:{' '}
            <span className={scoreColor(avgScore)}>{avgScore}</span>
          </h3>
          <h3 className="text-lg font-semibold">
            🧠 Advies:{' '}
            <span className="text-blue-600">{advies}</span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Tabs + Data */}
      <TechnicalTabs
        data={technicalData}
        loading={loading}
        error={error}
        timeframe={activeTab}
        setTimeframe={setActiveTab}
        onRemove={deleteAsset}
      />
    </div>
  );
}
