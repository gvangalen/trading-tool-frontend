'use client';
import { useMacroData } from '@/hooks/useMacroData';
import { useState } from 'react';

export default function MacroPage() {
  const { macroData, avgScore, advies, handleEdit, handleRemove } = useMacroData();
  const [editIndicator, setEditIndicator] = useState(null);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📊 Macro Indicators</h2>

      {/* Knop toevoegen (voor later: nieuwe macro toevoegen) */}
      {/* <button className="btn">➕ Add Indicator</button> */}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Indicator</th>
              <th className="p-2">Current Value</th>
              <th className="p-2">Trend</th>
              <th className="p-2">Interpretation</th>
              <th className="p-2">Action</th>
              <th className="p-2">Score</th>
              <th className="p-2">Edit</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {macroData.map((item) => (
              <tr key={item.name} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.value ?? 'N/A'}</td>
                <td className="p-2">Trend coming soon</td>
                <td className="p-2">Interpretation coming soon</td>
                <td className="p-2">Action coming soon</td>
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

      <h3 className="text-xl font-semibold">
        🌍 Macro Total Score: <span className="text-green-600">{avgScore}</span>
      </h3>
      <h3 className="text-xl font-semibold">
        📈 Macro Advice: <span className="text-blue-600">{advies}</span>
      </h3>

      {/* Modal voor Edit */}
      {editIndicator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-bold">✏️ Edit Indicator</h3>
            {/* Later: invoervelden toevoegen voor aanpassen thresholds etc. */}
            <button
              onClick={() => setEditIndicator(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
