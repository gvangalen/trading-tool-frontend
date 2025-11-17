'use client';

import { useEffect, useState } from 'react';

import {
  getMacroIndicatorNames,
  getScoreRulesForMacroIndicator,
  macroDataAdd,
} from '@/lib/api/macro';

import CardWrapper from '@/components/ui/CardWrapper';
import UniversalSearchDropdown from '@/components/ui/UniversalSearchDropdown';

export default function MacroIndicatorScoreView() {
  const [allIndicators, setAllIndicators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);
  const [added, setAdded] = useState(false);

  // -------------------------------------------------------
  // 📡 Indicatorlijst ophalen
  // -------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const list = await getMacroIndicatorNames();
        setAllIndicators(list);
      } catch (err) {
        console.error('❌ macro indicators ophalen', err);
      }
    }
    load();
  }, []);

  // -------------------------------------------------------
  // 📊 Scoreregels ophalen bij selectie
  // -------------------------------------------------------
  const onSelect = async (indicator) => {
    setSelected(indicator);

    try {
      const rules = await getScoreRulesForMacroIndicator(indicator.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ scoreregels ophalen', err);
    }
  };

  // -------------------------------------------------------
  // ➕ Toevoegen aan macro analyse
  // -------------------------------------------------------
  const handleAdd = async () => {
    if (!selected) return;

    try {
      await macroDataAdd(selected.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('❌ Toevoegen mislukt', err);
      alert('Toevoegen mislukt.');
    }
  };

  return (
    <CardWrapper title="🌍 Bekijk Macro Scorelogica">
      {/* =====================================================
          🔎 UNIVERSELE ZOEKDROPDOWN
      ===================================================== */}
      <UniversalSearchDropdown
        label="Zoek een macro-indicator"
        items={allIndicators}
        selected={selected}
        onSelect={onSelect}
        placeholder="Typ een naam zoals DXY, BTC Dominantie..."
      />

      {/* =====================================================
          📊 Scoreregels tabel
      ===================================================== */}
      {selected && scoreRules.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Scoreregels voor: {selected.display_name}
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
                    <td className="p-2">{r.action}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {!selected && (
        <p className="text-sm text-gray-500 italic">
          Typ en selecteer een indicator om scoreregels te bekijken.
        </p>
      )}

      {/* =====================================================
          ➕ Toevoegen knop
      ===================================================== */}
      <div className="pt-4">
        <button
          onClick={handleAdd}
          disabled={!selected}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          ➕ Voeg toe aan macro-analyse
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
