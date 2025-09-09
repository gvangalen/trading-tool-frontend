'use client';

import { useMacroData } from '@/hooks/useMacroData';
import { useState } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MacroPage() {
  const { macroData, avgScore, advies, handleEdit, handleRemove } = useMacroData();
  const [editIndicator, setEditIndicator] = useState(null);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">🌍 Macro Indicatoren</h1>

      <CardWrapper>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2">Indicator</th>
                <th className="p-2">Waarde</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Interpretatie</th>
                <th className="p-2">Actie</th>
                <th className="p-2">Score</th>
                <th className="p-2">✏️</th>
                <th className="p-2">🗑️</th>
              </tr>
            </thead>
            <tbody>
              {macroData.map((item) => (
                <tr key={item.name} className="border-t dark:border-gray-700">
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2">{item.value ?? 'N/A'}</td>
                  <td className="p-2">{item.trend?.trim() ? item.trend : <em className="text-gray-500">–</em>}</td>
                  <td className="p-2">{item.interpretation?.trim() ? item.interpretation : <em className="text-gray-500">–</em>}</td>
                  <td className="p-2">{item.action?.trim() ? item.action : <em className="text-gray-500">–</em>}</td>
                  <td className="p-2 font-bold">{item.score ?? '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setEditIndicator(item)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleRemove(item.name)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardWrapper>

      <CardWrapper>
        <h3 className="text-lg font-semibold">
          🌍 Macro Score: <span className="text-green-600">{avgScore}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          📈 Advies: <span className="text-blue-600">{advies}</span>
        </h3>
      </CardWrapper>

      {/* 💬 Edit Modal Placeholder */}
      {editIndicator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-bold">✏️ Bewerk {editIndicator.name}</h3>
            {/* Later: invulvelden */}
            <button
              onClick={() => setEditIndicator(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
