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
  data = [],          // 🔹 Alle data voor alle timeframes
  loading,
  error,
  timeframe,          // 🔹 Geselecteerde tab (Dag, Week, Maand, Kwartaal)
  setTimeframe,
  onRemove,
}) {
  useEffect(() => {
    console.log('🧪 [TechnicalTabs] Geselecteerde tab:', timeframe);
    console.log('📊 [TechnicalTabs] Ontvangen data:', data);
  }, [timeframe, data]);

  const getFilteredData = () => {
    const tfKey = TIMEFRAME_MAP[timeframe]; // 'day', 'week', ...
    return data.filter((item) => item.timeframe === tfKey);
  };

  const filteredData = getFilteredData();

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
      case 'Dag':
        return <TechnicalDayTable data={filteredData} onRemove={onRemove} />;
      case 'Week':
        return <TechnicalWeekTable data={filteredData} onRemove={onRemove} />;
      case 'Maand':
        return <TechnicalMonthTable data={filteredData} onRemove={onRemove} />;
      case 'Kwartaal':
        return <TechnicalQuarterTable data={filteredData} onRemove={onRemove} />;
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
        {Object.entries(TIMEFRAME_MAP).map(([label, tfKey]) => (
          <button
            key={label}
            onClick={() => setTimeframe(label)} // Let op: we gebruiken hier 'Dag', 'Week', etc.
            className={`px-4 py-2 rounded font-semibold border ${
              timeframe === label
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
