'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('Dag');

  // ✅ Haal alleen data op voor huidige timeframe
  const {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    deleteAsset,
  } = useTechnicalData(activeTab);

  useEffect(() => {
    console.log(`🧪 Timeframe actief: ${activeTab}`);
  }, [activeTab]);

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
            <span className={scoreColor(avgScore)}>{avgScore ?? 'N/A'}</span>
          </h3>
          <h3 className="text-lg font-semibold">
            🧠 Advies:{' '}
            <span className="text-blue-600">{advies}</span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Tabs + Tabel */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={technicalData}
        loading={loading}
        error={error}
        onRemove={deleteAsset}
      />
    </div>
  );
}
