'use client';

import { useState } from 'react';
import { useMacroData } from '@/hooks/useMacroData';
import CardWrapper from '@/components/ui/CardWrapper';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];

export default function MacroTabs() {
  const [activeTab, setActiveTab] = useState('Dag');
  const {
    macroData,
    avgScore,
    advies,
    handleEdit,
    handleRemove,
    calculateMacroScore,
    getExplanation,
    loading,
    error,
  } = useMacroData();

  const renderTableRows = () => {
    return macroData.map((item) => {
      const score = calculateMacroScore(item.name, parseFloat(item.value));
      const scoreColor =
        score >= 2 ? 'text-green-600' :
        score <= -2 ? 'text-red-600' :
        'text-gray-600';

      return (
        <tr key={item.name} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium" title={getExplanation(item.name)}>{item.name}</td>
          <td className="p-2">
            {activeTab === 'Dag' ? (
              <input
                type="number"
                className="w-20 border px-1 py-0.5 rounded"
                value={item.value}
                onChange={(e) => handleEdit(item.name, e.target.value)}
              />
            ) : (
              item.value ?? '–'
            )}
          </td>
          <td className="p-2 italic text-gray-500">{item.trend ?? '–'}</td>
          <td className="p-2 italic text-gray-500">{item.interpretation ?? '–'}</td>
          <td className="p-2 italic text-gray-500">{item.action ?? '–'}</td>
          <td className={`p-2 font-bold ${scoreColor}`}>{score}</td>
          <td className="p-2">
            <button
              onClick={() => handleRemove(item.name)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">🌍 Macro Indicatoren</h1>

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
                <th className="p-2">Indicator</th>
                <th className="p-2">Waarde</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Interpretatie</th>
                <th className="p-2">Actie</th>
                <th className="p-2">Score</th>
                <th className="p-2">🗑️</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">⏳ Laden...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-red-500">❌ {error}</td>
                </tr>
              ) : (
                renderTableRows()
              )}
            </tbody>
          </table>
        </div>
      </CardWrapper>

      {/* 🔹 Samenvatting */}
      <CardWrapper>
        <h3 className="text-lg font-semibold">
          🌍 Macro Score: <span className="text-green-600">{avgScore}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          📈 Advies: <span className="text-blue-600">{advies}</span>
        </h3>
      </CardWrapper>
    </div>
  );
}
