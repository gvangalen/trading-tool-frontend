'use client';

import { useState } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import UniversalSearchDropdown from '@/components/ui/UniversalSearchDropdown';

export default function MarketIndicatorScoreView({
  availableIndicators,
  selectedIndicator,
  scoreRules,
  selectIndicator,
  addMarketIndicator,
}) {
  const [added, setAdded] = useState(false);

  // ➕ Toevoegen aan market analyse
  const handleAdd = async () => {
    if (!selectedIndicator?.name) return;

    try {
      await addMarketIndicator(selectedIndicator.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('❌ Toevoegen mislukt:', err);
    }
  };

  return (
    <CardWrapper title="🪙 Bekijk Market Scorelogica">

      {/* =====================================================
          🔍 Universele zoek dropdown
      ===================================================== */}
      <UniversalSearchDropdown
        label="Zoek een market-indicator"
        placeholder="Typ een indicator zoals Price, Volume, Change 24h…"
        items={availableIndicators}
        selected={selectedIndicator}
        onSelect={selectIndicator}
      />

      {/* =====================================================
          📊 Scoreregels
      ===================================================== */}
      {selectedIndicator && scoreRules.length > 0 && (
        <div className="space-y-4 mt-4">
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
              {[...scoreRules]
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
          Typ en selecteer een indicator om scoreregels te bekijken.
        </p>
      )}

      {/* =====================================================
          ➕ Toevoegen knop
      ===================================================== */}
      <div className="pt-4">
        <button
          onClick={handleAdd}
          disabled={!selectedIndicator}
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
