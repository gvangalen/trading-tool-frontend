'use client';

import { useEffect } from 'react';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function MacroSummaryTableForDashboard({ data = [], loading = false, error = '' }) {
  useEffect(() => {
    console.log('🌍 [MacroSummaryTableForDashboard] ontvangen data:', data);
  }, [data]);

  // 🎨 Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (loading) return <SkeletonTable rows={5} columns={6} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        ⚠️ Geen macrodata beschikbaar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-2">🌍 Indicator</th>
            <th className="p-2 text-center">Waarde</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Advies</th>
            <th className="p-2">Uitleg</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const {
              indicator = item.name ?? '–',
              waarde = item.value ?? '–',
              score = item.score ?? null,
              advies = item.action ?? '–',
              uitleg = item.interpretation ?? '–',
            } = item;

            return (
              <tr key={`${indicator}-${index}`} className="border-t dark:border-gray-700">
                <td className="p-2 font-medium">{indicator}</td>
                <td className="p-2 text-center">{waarde}</td>
                <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
                  {score !== null ? score : '–'}
                </td>
                <td className="p-2 text-center">{advies}</td>
                <td className="p-2">{uitleg}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
