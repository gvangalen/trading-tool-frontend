'use client';

import { useEffect, useState } from 'react';
import {
  getIndicatorNames,
  getScoreRulesForIndicator,
  technicalDataAdd,
} from '@/lib/api/technical';
import CardWrapper from '@/components/ui/CardWrapper';

export default function IndicatorScoreView() {
  const [query, setQuery] = useState('');
  const [filteredIndicators, setFilteredIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);
  const [allIndicators, setAllIndicators] = useState([]);
  const [added, setAdded] = useState(false);

  // 🔁 Haal alle indicatornamen op bij laden
  useEffect(() => {
    async function fetchIndicators() {
      try {
        const res = await getIndicatorNames();
        setAllIndicators(res);
      } catch (error) {
        console.error('❌ Fout bij ophalen indicators:', error);
      }
    }
    fetchIndicators();
  }, []);

  // 🔎 Filter op basis van query
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

  // 📊 Wanneer een indicator wordt aangeklikt
  const handleSelect = async (indicator) => {
    setSelectedIndicator(indicator);
    setQuery(indicator.display_name);
    setFilteredIndicators([]);

    try {
      // ✅ Alleen de naam doorgeven
      await technicalDataAdd(indicator.name);

      // ✅ Bevestiging tonen
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      // ✅ Scoreregels ophalen
      const rules = await getScoreRulesForIndicator(indicator.name);
      setScoreRules(rules);
    } catch (error) {
      console.error('❌ Fout bij selecteren of toevoegen:', error);
    }
  };

  return (
    <CardWrapper title="🔎 Bekijk Scorelogica">
      {/* 🔍 Zoekveld */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Zoek een indicator
        </label>
        <input
          type="text"
          placeholder="Typ een naam, zoals RSI..."
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

      {/* ✅ Feedback toegevoegd */}
      {added && (
        <p className="text-green-600 text-sm mb-2">
          ✅ Toegevoegd aan technische analyse
        </p>
      )}

      {/* 📊 Scoreregels */}
      {selectedIndicator && scoreRules.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
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
              {scoreRules.map((r, i) => (
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
        </div>
      )}

      {/* 🕳️ Geen regels */}
      {selectedIndicator && scoreRules.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Geen scoreregels gevonden voor deze indicator.
        </p>
      )}
    </CardWrapper>
  );
}
