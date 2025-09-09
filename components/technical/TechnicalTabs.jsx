'use client';

import { useState } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import CardWrapper from '@/components/ui/CardWrapper';
import SkeletonTable from '@/components/ui/SkeletonTable';
import TechnicalDayTable from './TechnicalDayTable';
import TechnicalWeekTable from './TechnicalWeekTable';
import TechnicalMonthTable from './TechnicalMonthTable';
import TechnicalQuarterTable from './TechnicalQuarterTable';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];

export default function TechnicalTabs() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    query,
    sortField,
    sortOrder,
    setQuery,
    setSortField,
    setSortOrder,
    deleteAsset,
    setTimeframe
  } = useTechnicalData();

  const renderTableBody = () => {
    if (loading) return <SkeletonTable rows={5} columns={7} />;
    if (error) return <div className="text-sm text-red-500">{error}</div>;

    switch (activeTab) {
      case 'Dag':
        return (
          <TechnicalDayTable
            data={technicalData}
            query={query}
            sortField={sortField}
            sortOrder={sortOrder}
            setQuery={setQuery}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            deleteAsset={deleteAsset}
          />
        );
      case 'Week':
        return <TechnicalWeekTable data={technicalData} />;
      case 'Maand':
        return <TechnicalMonthTable data={technicalData} />;
      case 'Kwartaal':
        return <TechnicalQuarterTable data={technicalData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Tabs */}
      <div className="flex space-x-4 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold border text-sm ${
              activeTab === tab
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Tabel */}
      <CardWrapper>
        <div className="overflow-x-auto">{renderTableBody()}</div>
      </CardWrapper>
    </div>
  );
}
