'use client';

import { useState } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    avgScore,
    advies,
    handleRemove,
    loading,
    error,
  } = useTechnicalData(activeTab);

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">📊 Technische Analyse</h1>

      {/* 🔹 Totale technische score */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
        <p className="text-lg font-semibold">
          🧮 Totale Technische Score:{' '}
          <span className={getScoreColor(avgScore)}>{avgScore}</span>
        </p>
        <p className="text-lg">
          🧠 Advies: <span className="text-blue-600">{advies}</span>
        </p>
      </div>

      {/* 🔹 Tabs + Tabel */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loading}
        error={error}
        handleRemove={handleRemove}
      />
    </div>
  );
}
