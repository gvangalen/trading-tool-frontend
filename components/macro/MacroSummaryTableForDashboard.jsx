'use client';

import { useMacroData } from '@/hooks/useMacroData';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function MacroSummaryTableForDashboard() {
  const {
    macroData,
    calculateMacroScore,
    getExplanation,
    loading,
    error,
  } = useMacroData();

  if (loading) return <SkeletonTable rows={5} columns={5} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  // Alleen top 5 of recente macro indicators tonen
  const displayedData = macroData.slice(0, 5);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">🌍 Indicator</th>
            <th className="p-2">Waarde</th>
            <th className="p-2">Trend</th>
            <th className="p-2">Interpretatie</th>
            <th className="p-2 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((ind) => {
            const score = calculateMacroScore(ind.name, parseFloat(ind.value));
            const scoreColor =
              score >= 2 ? 'text-green-600' :
              score <= -2 ? 'text-red-600' :
              'text-gray-600';

            return (
              <tr key={ind.name} className="border-t">
                <td className="p-2" title={getExplanation(ind.name)}>{ind.name}</td>
                <td className="p-2">{ind.value}</td>
                <td className="p-2">{ind.trend || '–'}</td>
                <td className="p-2">{ind.interpretation || '–'}</td>
                <td className={`p-2 text-center font-semibold ${scoreColor}`}>{score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
