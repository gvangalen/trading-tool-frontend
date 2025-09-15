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

export default function TechnicalTabs() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    technicalData,
    loading,
    error,
    setTimeframe,
    calculateTechnicalScore,
  } = useTechnicalData();

  useEffect(() => {
    setTimeframe(TIMEFRAME_MAP[activeTab]);
  }, [activeTab, setTimeframe]);

  const getIndicatorData = (indicator) => {
    const item = technicalData[0]; // alleen BTC
    if (!item) return null;

    switch (indicator) {
      case 'RSI':
        return {
          value: item.rsi,
          score: calculateTechnicalScore({ ...item, rsi: item.rsi }),
          advice:
            item.rsi < 30 ? '🟢 Oversold' :
            item.rsi > 70 ? '🔴 Overbought' :
            '⚖️ Neutraal',
          explanation: 'Relative Strength Index (momentum indicator)',
        };
      case 'Volume':
        return {
          value: item.volume,
          score: item.volume > 500000000 ? 1 : 0,
          advice: item.volume > 500000000 ? '🔼 Hoog' : '🔽 Laag',
          explanation: 'Handelsvolume in 24 uur',
        };
      case '200MA':
        return {
          value: item.price > item.ma_200 ? 'Boven MA' : 'Onder MA',
          score: item.price > item.ma_200 ? 1 : -1,
          advice: item.price > item.ma_200 ? '✅ Bullish' : '⚠️ Bearish',
          explanation: '200-daags voortschrijdend gemiddelde',
        };
      default:
        return null;
    }
  };

  const indicators = ['RSI', 'Volume', '200MA'];

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
                indicators.map((name) => {
                  const item = getIndicatorData(name);
                  return (
                    <tr key={name}>
                      <td className="p-2 font-medium">{name}</td>
                      <td className="p-2 text-center">{item?.value ?? '-'}</td>
                      <td className="p-2 text-center">{item?.score ?? '-'}</td>
                      <td className="p-2 text-center">{item?.advice ?? '-'}</td>
                      <td className="p-2">{item?.explanation ?? '-'}</td>
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
