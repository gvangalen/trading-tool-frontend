'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  // ✅ Standaard tab = 'Dag'
  const [activeTab, setActiveTab] = useState('Dag');

  // ✅ Data ophalen via hook (nu gekoppeld aan actieve tab)
  const {
    avgScore = 'N/A',
    advies = 'Neutraal',
    technicalData = [],
    loading,
    error,
    deleteAsset,
  } = useTechnicalData(activeTab); // ✅ Gekoppeld aan actieve tab (Dag, Week, Maand, Kwartaal)

  // ✅ Extra logging bij elke update
  useEffect(() => {
    console.log(`🔁 [TechnicalPage] Timeframe: ${activeTab}`);
    console.log('📊 [TechnicalPage] Technical data:', technicalData);
    console.log('📉 [TechnicalPage] Loading:', loading);
    console.log('⚠️ [TechnicalPage] Error:', error);
  }, [technicalData, loading, error, activeTab]);

  // ✅ Scorekleur voor samenvatting
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
