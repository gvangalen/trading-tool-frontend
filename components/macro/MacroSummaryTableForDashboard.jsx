'use client';

import { useEffect } from 'react';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function MacroSummaryTableForDashboard({ data = [], loading = false, error = '' }) {
  useEffect(() => {
    console.log('🌍 [MacroSummaryTableForDashboard] ontvangen data:', data);
  }, [data]);

  if (loading) return <SkeletonTable rows={5} columns={5} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Geen macrodata beschikbaar.
      </div>
    );
  }

  const displayedData = data.slice(0, 5); // Bijv. alleen BTC-gerelateerde macro's

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-2">🌍 Indicator</th>
            <th className="p-2 text-center">Waarde</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Trend</th>
            <th className="p-2">Toelichting</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, index) => (
            <tr key={item.indicator || index} className="border-t">
              <td className="p-2 font-medium">{item.indicator}</td>
              <td className="p-2 text-center">{item.waarde ?? '–'}</td>
              <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
                {item.score ?? '–'}
              </td>
              <td className="p-2 text-center">{item.trend ?? '–'}</td>
              <td className="p-2">{item.toelichting ?? '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
