'use client';

import { useState, useEffect } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketIndicatorScoreView({
  availableIndicators,
  selectedIndicator,
  scoreRules,
  selectIndicator,
  addMarketIndicator,
}) {
  const [selectedName, setSelectedName] = useState(selectedIndicator?.name || '');
  const [added, setAdded] = useState(false);

  // als parent een andere indicator selecteert, sync de dropdown
  useEffect(() => {
    if (selectedIndicator?.name) {
      setSelectedName(selectedIndicator.name);
    }
  }, [selectedIndicator]);

  const handleChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);

    const found = availableIndicators.find((i) => i.name === name);
    if (found) {
      selectIndicator(found);
    }
  };

  const handleAdd = async () => {
    if (!selectedName) return;
    try {
      await addMarketIndicator(selectedName);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('❌ Toevoegen mislukt:', err);
    }
  };

  return (
    <CardWrapper title="🪙 Bekijk Market Scorelogica">
      {/* 🔽 Eenvoudige select in plaats van custom dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Kies een market-indicator
        </label>
        <select
          value={selectedName}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">– kies een indicator –</option>
          {availableIndicators.map((i) => (
            <option key={i.name} value={i.name}>
              {i.display_name} ({i.name})
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Scoreregels */}
      {selectedIndicator && scoreRules.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Scoreregels voor: {selectedIndicator.display_name}
          </h3>

          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 text-left">Range</th>
                <th className="p-2 text-left">Score</th>
                <th className="p-2 text-left">Trend</th>
                <th className="p-2 text-left">Interpretatie</th>
                <th className="p-2 text-left">Actie</th>
              </tr>
            </thead>
            <tbody>
              {scoreRules
                .slice() // kopie voor safe sort
                .sort((a, b) => a.range_min - b.range_min)
                .map((r, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-600">
                    <td className="p-2">
                      {r.range_min} – {r.range_max}
                    </td>
                    <td className="p-2 font-semibold text-blue-600 dark:text-blue-300">
                      {r.score}
                    </td>
                    <td className="p-2 italic">{r.trend}</td>
                    <td className="p-2">{r.interpretation}</td>
                    <td className="p-2 text-gray-500">{r.action}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedIndicator && (
        <p className="text-sm text-gray-500 italic mt-2">
          Kies een indicator om de scoreregels te bekijken.
        </p>
      )}

      {/* ➕ Toevoegen */}
      <div className="pt-4">
        <button
          onClick={handleAdd}
          disabled={!selectedName}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          ➕ Voeg toe aan market-analyse
        </button>
        {added && (
          <p className="text-green-600 text-sm mt-1">
            ✅ Indicator succesvol toegevoegd
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
