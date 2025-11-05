'use client';

import { useEffect, useState } from 'react';
import {
  getMacroIndicatorNames,
  getScoreRulesForMacroIndicator,
  macroDataAdd,
} from '@/lib/api/macro'; // 👉 macro API-endpoints
import CardWrapper from '@/components/ui/CardWrapper';

export default function MacroIndicatorScoreView() {
  const [query, setQuery] = useState('');
  const [filteredIndicators, setFilteredIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);
  const [allIndicators, setAllIndicators] = useState([]);
  const [added, setAdded] = useState(false);

  // 📡 Alle macro-indicatoren ophalen
  useEffect(() => {
    async function fetchIndicators() {
      try {
        const res = await getMacroIndicatorNames();
        setAllIndicators(res);
      } catch (error) {
        console.error('❌ Fout bij ophalen macro indicators:', error);
      }
    }
    fetchIndicators();
  }, []);

  // 🔎 Filter tijdens typen
  useEffect(() => {
    if (query.length === 0) {
      setFilteredIndicators([]);
      return;
    }
    const filtered = allIndicators.filter((i) =>
      i.display_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredIndicators(filtered);
  }, [query, allIndicators]);

  // 📊 Scoreregels ophalen bij selectie
  const handleSelect = async (indicator) => {
    setSelectedIndicator(indicator);
    setQuery('');
    setFilteredIndicators([]);
    setScoreRules([]);

    try {
      const rules = await getScoreRulesForMacroIndicator(indicator.name);
      setScoreRules(rules);
    } catch (error) {
      console.error('❌ Fout bij ophalen macro scoreregels:', error);
    }
  };

  // ➕ Toevoegen aan macro-data
  const handleAdd = async () => {
    try {
      await macroDataAdd(selectedIndicator.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('❌ Fout bij toevoegen macro indicator:', error);
    }
  };

  return (
    <CardWrapper title="🌍 Bekijk Macro Scorelogica">
      {/* 🔍 Zoekveld */}
      <div className="mb-6 relative">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Zoek een macro-indicator
        </label>
        <input
          type="text"
          placeholder="Typ een naam, zoals DXY of BTC Dominantie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-100"
        />

        {filteredIndicators.length > 0 && (
          <ul className="absolute z-10 w-full border rounded shadow mt-1 max-h-48 overflow-y-auto bg-white dark:bg-gray-800">
            {filteredIndicators.map((i) => (
              <li
                key={i.name}
                onClick={() => handleSelect(i)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {i.display_name}{' '}
                <span className="text-xs text-gray-400">({i.name})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📈 Scoreregels */}
      {selectedIndicator && (
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
              {[...scoreRules]
                .sort((a, b) => a.range_min - b.range_min)
                .map((r, i) => (
                  <tr key={i} className="border-t dark:border-gray-600">
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

          {/* ➕ Knop onderaan */}
          <div className="pt-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Voeg toe aan macro-analyse
            </button>
            {added && (
              <p className="text-green-600 text-sm mt-1">
                ✅ Succesvol toegevoegd
              </p>
            )}
          </div>
        </div>
      )}

      {/* 🕳️ Geen regels */}
      {selectedIndicator && scoreRules.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Geen scoreregels gevonden voor deze macro-indicator.
        </p>
      )}
    </CardWrapper>
  );
}
