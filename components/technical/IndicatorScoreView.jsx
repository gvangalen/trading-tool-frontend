'use client';

import { useState } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import UniversalSearchDropdown from '@/components/ui/UniversalSearchDropdown';

export default function IndicatorScoreView({
  indicatorNames = [],        // ⬅️ lijst van useTechnicalData
  selectedIndicator,
  onSelectIndicator,          // ⬅️ loadScoreRules + setSelectedIndicator
  scoreRules = [],
  addTechnicalData,           // ⬅️ functie uit hook
}) {
  const [added, setAdded] = useState(false);

  // ➕ Toevoegen aan technische analyse
  const handleAdd = async () => {
    if (!selectedIndicator?.name) return;

    try {
      await addTechnicalData(selectedIndicator.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('❌ Toevoegen mislukt:', error);
    }
  };

  return (
    <CardWrapper title="🔎 Bekijk Scorelogica">

      {/* =====================================================
          🔍 Universele Zoek Dropdown
      ===================================================== */}
      <UniversalSearchDropdown
        label="Zoek een technische indicator"
        placeholder="Typ bijvoorbeeld RSI, MA200, Volume…"
        items={indicatorNames}           // ⬅️ JUISTE PROP
        selected={selectedIndicator}
        onSelect={onSelectIndicator}     // ⬅️ JUISTE FUNCTIE
      />


      {/* =====================================================
          📈 Score Regels
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
          Typ en selecteer een indicator om de scoreregels te bekijken.
        </p>
      )}


      {/* =====================================================
          ➕ Toevoegen
      ===================================================== */}
      <div className="pt-4">
        <button
          onClick={handleAdd}
          disabled={!selectedIndicator}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          ➕ Voeg toe aan technische analyse
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
