'use client';

import { useEffect } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';

const TABS = ['day', 'week', 'month', 'quarter'];

// ✅ Nieuwe scorekleur-logica (10–100)
const getScoreColor = (score) => {
  const s = typeof score === 'number' ? score : parseFloat(score);
  if (isNaN(s)) return 'text-gray-600';
  if (s >= 70) return 'text-green-600';
  if (s <= 40) return 'text-red-600';
  return 'text-yellow-600';
};

export default function TechnicalTabs({
  timeframe,
  setTimeframe,
  dayData,
  weekData,
  monthData,
  quarterData,
  loading,
  error,
  onRemove,
}) {
  useEffect(() => {
    console.log('🧪 TechnicalTabs mounted, timeframe:', timeframe);
  }, [timeframe]);

  const getActiveData = () => {
    switch (timeframe) {
      case 'week':
        return weekData;
      case 'month':
        return monthData;
      case 'quarter':
        return quarterData;
      case 'day':
      default:
        return dayData;
    }
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-500">
            ⏳ Loading...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-red-500">
            ❌ {error}
          </td>
        </tr>
      );
    }

    const data = getActiveData();

    if (!data || !data.length) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-400">
            No data available
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr key={item.symbol || index} className="border-t dark:border-gray-700">
        <td className="p-2 font-medium">{item.indicator}</td>
        <td className="p-2 text-center">{item.waarde ?? '–'}</td>
        <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
          {item.score ?? '–'}
        </td>
        <td className="p-2 text-center">{item.advies ?? '–'}</td>
        <td className="p-2">{item.uitleg ?? '–'}</td>
        <td className="p-2 text-center">
          <button
            onClick={() => onRemove?.(item.symbol)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ❌
          </button>
        </td>
      </tr>
    ));
  };

  const labelMap = {
    day: 'Dag',
    week: 'Week',
    month: 'Maand',
    quarter: 'Kwartaal',
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setTimeframe(tab)}
            className={`px-4 py-2 rounded font-semibold border ${
              timeframe === tab
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {labelMap[tab]} {/* Label in NL, value in EN */}
          </button>
        ))}
      </div>

      {/* Tabel */}
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
