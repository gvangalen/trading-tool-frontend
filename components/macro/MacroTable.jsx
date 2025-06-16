'use client';

import { useMacroData } from '@/hooks/useMacroData';
import SkeletonTable from '@/components/ui/SkeletonTable'; // 🔁 Correcte nieuwe map!

export default function MacroTable() {
  const {
    macroData,
    avgScore,
    advies,
    calculateMacroScore,
    getExplanation,
    handleEdit,
    handleRemove,
    loading,
    error,
  } = useMacroData();

  console.log('📊 Macro data:', macroData);
  
  if (loading) return <SkeletonTable rows={6} columns={6} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {/* 🔹 Score Summary */}
      <div className="text-sm text-gray-700">
        Gemiddelde score: <strong>{avgScore}</strong> | Advies: <strong>{advies}</strong>
      </div>

      {/* 🔹 Macro Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Indicator</th>
              <th>Waarde</th>
              <th>Trend</th>
              <th>Interpretatie</th>
              <th>Actie</th>
              <th>Score</th>
              <th>❌</th>
            </tr>
          </thead>
          <tbody>
            {macroData.map((ind) => {
              const score = calculateMacroScore(ind.name, parseFloat(ind.value));
              const scoreColor =
                score >= 2 ? 'text-green-600' :
                score <= -2 ? 'text-red-600' :
                'text-gray-600';

              return (
                <tr key={ind.name} className="border-t">
                  <td className="p-2" title={getExplanation(ind.name)}>{ind.name}</td>
                  <td>
                    <input
                      type="number"
                      className="w-20 border px-1 py-0.5 rounded"
                      value={ind.value}
                      onChange={e => handleEdit(ind.name, e.target.value)}
                    />
                  </td>
                  <td>{ind.trend || '–'}</td>
                  <td>{ind.interpretation || '–'}</td>
                  <td>{ind.action || '–'}</td>
                  <td className={`font-semibold ${scoreColor}`} title={`Score berekend op basis van ${ind.name}`}>
                    {score}
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleRemove(ind.name)}>❌</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
