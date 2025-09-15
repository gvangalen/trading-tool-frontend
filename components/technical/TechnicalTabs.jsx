'use client';

import { useEffect } from 'react';
import TechnicalDayTable from '@/components/technical/TechnicalDayTable';
import CardWrapper from '@/components/ui/CardWrapper';

const TABS = ['Dag', 'Week', 'Maand', 'Kwartaal'];
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

  const activeTab = Object.entries(TIMEFRAME_MAP).find(
    ([label, tf]) => tf === timeframe
  )?.[0] || 'Dag';

  return (
    <>
      {/* 🔹 Tabs */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setTimeframe(TIMEFRAME_MAP[tab])}
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
                <th className="p-2 text-center">Actie</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    ⏳ Laden...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-red-500">
                    ❌ {error}
                  </td>
                </tr>
              ) : (
                <TechnicalDayTable data={data} onRemove={onRemove} showDebug={false} />
              )}
            </tbody>
          </table>
        </div>
      </CardWrapper>
    </>
  );
}
