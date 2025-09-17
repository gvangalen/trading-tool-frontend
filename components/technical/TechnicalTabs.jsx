'use client';

import { useEffect } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import TechnicalDayTable from '@/components/technical/TechnicalDayTable';
import TechnicalWeekTable from '@/components/technical/TechnicalWeekTable';
import TechnicalMonthTable from '@/components/technical/TechnicalMonthTable';
import TechnicalQuarterTable from '@/components/technical/TechnicalQuarterTable';

// 🗂️ Mapping van labels → timeframe strings
const TIMEFRAME_MAP = {
  Dag: 'day',
  Week: 'week',
  Maand: 'month',
  Kwartaal: 'quarter',
};

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

    switch (timeframe) {
      case 'day':
        return <TechnicalDayTable data={data} onRemove={onRemove} />;
      case 'week':
        return <TechnicalWeekTable data={data} onRemove={onRemove} />;
      case 'month':
        return <TechnicalMonthTable data={data} onRemove={onRemove} />;
      case 'quarter':
        return <TechnicalQuarterTable data={data} onRemove={onRemove} />;
      default:
        return (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500">
              ⚠️ Ongeldige timeframe
            </td>
          </tr>
        );
    }
  };

  return (
    <>
      {/* 🔹 Tabs */}
      <div className="flex space-x-4 mb-4">
        {Object.entries(TIMEFRAME_MAP).map(([label, tf]) => (
          <button
            key={label}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded font-semibold border ${
              timeframe === tf
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {label}
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
