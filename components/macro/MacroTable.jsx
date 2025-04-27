'use client';

import { useMacroData } from '@/hooks/useMacroData';
import SkeletonTable from '@/components/SkeletonTable'; // ✅ Vergeet deze import niet!

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
    error
  } = useMacroData();

  return (
    <div className="space-y-4">
      {loading ? (
        <SkeletonTable rows={6} columns={6} />
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <>
          <div className="text-sm text-gray-700">
            Gemiddelde score: <strong>{avgScore}</strong> | Advies: <strong>{advies}</strong>
          </div>

          <table className="w-full border text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Indicator</th>
                <th>Waarde</th>
                <th>Trend</th>
                <th>Interpretatie</th>
                <th>Actie</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {macroData.map(ind => {
                const score = calculateMacroScore(ind.name, parseFloat(ind.value));
                const kleur =
                  score >= 2 ? 'text-green-600' :
                  score <= -2 ? 'text-red-600' :
                  'text-gray-600';

                return (
                  <tr key={ind.name} className="border-t">
                    <td className="p-2" title={getExplanation(ind.name)}>{ind.name}</td>
                    <td>{ind.value}</td>
                    <td>{ind.trend || '–'}</td>
                    <td>{ind.interpretation || '–'}</td>
                    <td>{ind.action || '–'}</td>
                    <td className={`${kleur} font-semibold`}>{score}</td>
                    <td>
                      <button onClick={() => handleEdit(ind.name, ind.value)} className="mr-2">✏️</button>
                      <button onClick={() => handleRemove(ind.name)}>❌</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
