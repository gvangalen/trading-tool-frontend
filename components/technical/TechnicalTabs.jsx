'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import CardWrapper from '@/components/ui/CardWrapper';
import TechnicalDayTable from './TechnicalDayTable';
import TechnicalWeekTable from './TechnicalWeekTable';
import TechnicalMonthTable from './TechnicalMonthTable';
import TechnicalQuarterTable from './TechnicalQuarterTable';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];
const TIMEFRAME_MAP = {
  Dag: 'day',
  Week: 'week',
  Maand: 'month',
  Kwartaal: 'quarter',
};
const TABLE_COMPONENTS = {
  Dag: TechnicalDayTable,
  Week: TechnicalWeekTable,
  Maand: TechnicalMonthTable,
  Kwartaal: TechnicalQuarterTable,
};

export default function TechnicalTabs() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    loading,
    error,
    setTimeframe,
    deleteAsset,
    getExplanation,
    calculateTechnicalScore,
  } = useTechnicalData();

  useEffect(() => {
    setTimeframe(TIMEFRAME_MAP[activeTab]);
  }, [activeTab, setTimeframe]);

  const ActiveTable = TABLE_COMPONENTS[activeTab];

  return (
    <>
      {/* 🔹 Tabs */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold border ${
              activeTab === tab
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Inhoud */}
      <CardWrapper>
        {loading ? (
          <div className="p-4 text-center text-gray-500">⏳ Laden...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">❌ {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <ActiveTable
              data={technicalData}
              onRemove={deleteAsset}
              getExplanation={getExplanation}
              calculateScore={calculateTechnicalScore}
            />
          </div>
        )}
      </CardWrapper>
    </>
  );
}
