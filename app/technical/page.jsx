'use client';

import { useState } from 'react';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import CardWrapper from '@/components/ui/CardWrapper';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function TechnicalPage() {
  const [activeTimeframe, setActiveTimeframe] = useState('1d'); // Dag = 1d
  const {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    deleteAsset,
  } = useTechnicalData();

  const filtered = technicalData.filter(
    (item) => item.symbol === 'BTC' && item.timeframe === activeTimeframe
  );

  const TABS = [
    { label: 'Dag', value: '1d' },
    { label: 'Week', value: '1w' },
    { label: 'Maand', value: '1mo' },
    { label: 'Kwartaal', value: '3mo' },
  ];

  const scoreColor = (score) => {
    if (score >= 1.5) return 'text-green-600';
    if (score <= -1.5) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-screen-md mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">📊 Technische Indicatoren – BTC</h1>

      {/* 📈 Samenvatting */}
      {!loading && (
        <div className="pt-2 text-sm sm:text-base space-y-2">
          <p>
            <strong>📊 Gemiddelde Score:</strong>{' '}
            <span className={scoreColor(avgScore)}>{avgScore}</span>
          </p>
          <p>
            <strong>🧠 Advies:</strong>{' '}
            <span className="text-blue-600 font-medium">{advies}</span>
          </p>
        </div>
      )}

      {/* 🔁 Tabs */}
      <div className="flex gap-3 text-sm">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTimeframe(tab.value)}
            className={`px-4 py-2 rounded border font-medium ${
              activeTimeframe === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📋 Tabel */}
      <CardWrapper>
        {loading ? (
          <SkeletonTable rows={4} columns={4} />
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <table className="w-full text-sm border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Indicator</th>
                <th className="p-2">Waarde</th>
                <th className="p-2">Score</th>
                <th className="p-2">Trend</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const trend =
                  item._score >= 1.5
                    ? '🟢 Bullish'
                    : item._score <= -1.5
                    ? '🔴 Bearish'
                    : '⚖️ Neutraal';

                const color =
                  item._score >= 1.5
                    ? 'text-green-600'
                    : item._score <= -1.5
                    ? 'text-red-600'
                    : 'text-gray-600';

                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2">{item.value}</td>
                    <td className={`p-2 font-semibold ${color}`}>{item._score}</td>
                    <td className="p-2">{trend}</td>
                    <td className="p-2">
                      <button
                        className="text-red-500 text-xs hover:underline"
                        onClick={() => deleteAsset(item.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardWrapper>
    </div>
  );
}
