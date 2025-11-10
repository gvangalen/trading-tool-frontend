'use client';

import { useState } from 'react';
import { useMacroData } from '@/hooks/useMacroData';
import CardWrapper from '@/components/ui/CardWrapper';
import MacroDayTable from './MacroDayTable';
import MacroWeekTable from './MacroWeekTable';
import MacroMonthTable from './MacroMonthTable';
import MacroQuarterTable from './MacroQuarterTable';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];

export default function MacroTabs() {
  const [activeTab, setActiveTab] = useState('Dag');

  const {
    macroData,
    avgScore,
    advies,
    removeMacroIndicator,
    getExplanation,
    loading,
    error,
  } = useMacroData(activeTab);

  // 🔁 Render juiste tabel per tab
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="p-4 text-center text-gray-500">
            ⏳ Laden...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7} className="p-4 text-center text-red-500">
            ❌ {error}
          </td>
        </tr>
      );
    }

    switch (activeTab) {
      case 'Dag':
        return (
          <MacroDayTable
            data={macroData}
            onRemove={removeMacroIndicator}
            getExplanation={getExplanation}
          />
        );
      case 'Week':
        return (
          <MacroWeekTable
            data={macroData}
            onRemove={removeMacroIndicator}
          />
        );
      case 'Maand':
        return (
          <MacroMonthTable
            data={macroData}
            onRemove={removeMacroIndicator}
          />
        );
      case 'Kwartaal':
        return (
          <MacroQuarterTable
            data={macroData}
            onRemove={removeMacroIndicator}
          />
        );
      default:
        return null;
    }
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

      {/* 🔹 Overzicht header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📊 Gemiddelde macroscore: <strong>{avgScore}</strong> ({advies})
        </p>
      </div>

      {/* 🔹 Macro Tabel */}
      <CardWrapper>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            {/* ✅ Header tonen voor alle tabs */}
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2">Indicator</th>
                <th className="p-2 text-center">Waarde</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">Advies</th>
                <th className="p-2 text-center">Uitleg</th>
                <th className="p-2 text-center">🗑️</th>
              </tr>
            </thead>

            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </CardWrapper>
    </>
  );
}
