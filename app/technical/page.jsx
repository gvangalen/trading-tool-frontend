'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const [timeframe, setTimeframe] = useState('day');

  const {
    dayData,
    weekData,
    monthData,
    quarterData,
    overallScore,
    overallAdvies,
    loading,
    error,
    deleteAsset,
  } = useTechnicalData(timeframe);

  useEffect(() => {
    console.log(`🧪 Active timeframe: ${timeframe}`);
  }, [timeframe]);

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
      <h1 className="text-2xl font-bold">🧪 Technical Analysis</h1>

      {/* 🔹 Totale technische score uit backend */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            🧮 Totale Technische Score:{' '}
            <span className={getScoreColor(overallScore)}>
              {overallScore ?? 'N/A'}
            </span>
          </h3>
          <h3 className="text-lg font-semibold">
            🧠 Algemeen Advies:{' '}
            <span className="text-blue-600">{overallAdvies}</span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Tabs + Tabel per timeframe */}
      <TechnicalTabs
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        dayData={dayData}
        weekData={weekData}
        monthData={monthData}
        quarterData={quarterData}
        loading={loading}
        error={error}
        onRemove={deleteAsset}
      />
    </div>
  );
}
