'use client';

import { useState, useEffect } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import CardWrapper from '@/components/ui/CardWrapper';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];
const TIMEFRAME_MAP = {
  Dag: 'day',
  Week: 'week',
  Maand: 'month',
  Kwartaal: 'quarter',
};

const INDICATORS = ['RSI', 'Volume', '200MA'];

export default function TechnicalTabs() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    loading,
    error,
    setTimeframe,
  } = useTechnicalData();

  useEffect(() => {
    setTimeframe(TIMEFRAME_MAP[activeTab]);
  }, [activeTab, setTimeframe]);

  const getIndicatorData = (indicator) => {
    const item = technicalData.find((d) => d.indicator === indicator);
    if (!item) return null;

    return {
      value: item.waarde ?? '-',
      score: item.score ?? '-',
      advice: item.advies ?? '-',
      explanation: item.uitleg ?? '-',
    };
  };

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

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

      {/* 🔹 Tabel */}
      <CardWrapper>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2">📊 Indicator</th>
                <th className="p-2 text-center">Waarde</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">Advies</th>
                <th className="p-2">Uitleg</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    ⏳ Laden...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-red-500">
                    ❌ {error}
                  </td>
                </tr>
              ) : technicalData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Geen technische data beschikbaar.
                  </td>
                </tr>
              ) : (
                INDICATORS.map((name) => {
                  const item = getIndicatorData(name);
                  return (
                    <tr key={name} className="border-t dark:border-gray-700">
                      <td className="p-2 font-medium">{name}</td>
                      <td className="p-2 text-center">{item?.value ?? '–'}</td>
                      <td className={`p-2 text-center font-bold ${getScoreColor(item?.score)}`}>
                        {item?.score ?? '–'}
                      </td>
                      <td className="p-2 text-center">{item?.advice ?? '–'}</td>
                      <td className="p-2">{item?.explanation ?? '–'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardWrapper>
    </>
  );
}
