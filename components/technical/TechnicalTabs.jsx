'use client';

import { useEffect } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];

export default function TechnicalTabs({
  data = [],
  loading,
  error,
  timeframe,
  setTimeframe,
  onRemove,
}) {
  useEffect(() => {
    console.log('🧪 TechnicalTabs mounted, timeframe:', timeframe);
  }, [timeframe]);

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-500">
            ⏳ Laden...
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

    if (!data.length) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-400">
            Geen data gevonden
          </td>
        </tr>
      );
    }

    return data.map((item) => (
      <tr key={item.id || item.symbol} className="border-t">
        <td className="p-2 font-medium">{item.indicator}</td>
        <td className="p-2 text-center">{item.value ?? '–'}</td>
        <td
          className={`p-2 text-center font-bold ${
            item.score >= 2
              ? 'text-green-600'
              : item.score <= -2
              ? 'text-red-600'
              : 'text-gray-600'
          }`}
        >
          {item.score ?? '–'}
        </td>
        <td className="p-2 text-center">{item.advice ?? '–'}</td>
        <td className="p-2">{item.explanation ?? '–'}</td>
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
            {tab}
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
