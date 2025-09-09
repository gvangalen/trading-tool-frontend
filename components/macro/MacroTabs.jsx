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

  // 🧠 Injecteer de actieve tab in de hook
  const {
    macroData,
    handleEdit,
    handleRemove,
    calculateMacroScore,
    getExplanation,
    loading,
    error,
  } = useMacroData(activeTab); // <--- 🔁 aangepaste hook!

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="p-4 text-center text-gray-500">⏳ Laden...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7} className="p-4 text-center text-red-500">❌ {error}</td>
        </tr>
      );
    }

    switch (activeTab) {
      case 'Dag':
        return (
          <MacroDayTable
            data={macroData}
            onEdit={handleEdit}
            onRemove={handleRemove}
            getExplanation={getExplanation}
            calculateScore={calculateMacroScore}
          />
        );
      case 'Week':
        return (
          <MacroWeekTable
            data={macroData}
            calculateScore={calculateMacroScore}
            getExplanation={getExplanation}
          />
        );
      case 'Maand':
        return (
          <MacroMonthTable
            data={macroData}
            calculateScore={calculateMacroScore}
            getExplanation={getExplanation}
          />
        );
      case 'Kwartaal':
        return (
          <MacroQuarterTable
            data={macroData}
            calculateScore={calculateMacroScore}
            getExplanation={getExplanation}
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

      {/* 🔹 Macro Tabel */}
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
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </CardWrapper>
    </>
  );
}
