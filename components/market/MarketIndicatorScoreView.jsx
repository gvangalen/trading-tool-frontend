'use client';

import { useEffect, useState } from 'react';
import {
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  marketDataAdd,
} from '@/lib/api/market'; // ✅ Market API-endpoints
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketIndicatorScoreView() {
  const [query, setQuery] = useState('');
  const [filteredIndicators, setFilteredIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);
  const [allIndicators, setAllIndicators] = useState([]);
  const [added, setAdded] = useState(false);

  // 📡 Alle market-indicatoren ophalen
  useEffect(() => {
    async function fetchIndicators() {
      try {
        const res = await getMarketIndicatorNames();
        setAllIndicators(res);
      } catch (error) {
        console.error('❌ Fout bij ophalen market indicators:', error);
      }
    }
    fetchIndicators();
  }, []);

  // 🔎 Live filter
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
      const rules = await getScoreRulesForMarketIndicator(indicator.name);
      setScoreRules(rules);
    } catch (error) {
      console.error('❌ Fout bij ophalen market scoreregels:', error);
    }
  };

  // ➕ Toevoegen aan market-analyse
  const handleAdd = async () => {
    if (!selectedIndicator || !selectedIndicator.name) {
      alert('⚠️ Selecteer eerst een indicator.');
      return;
    }

    try {
      console.log(`📤 Voeg toe aan market_analyse: ${selectedIndicator.name}`);
      await marketDataAdd(selectedIndicator.name);

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('❌ Fout bij toevoegen market indicator:', error);
      alert('❌ Toevoegen mislukt. Check console.');
    }
  };

  return (
    <CardWrapper title="🪙 Bekijk Market Scorelogica">
      
      {/* 🔍 Zoekveld */}
      <div className="mb-6 relative">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Zoek een market-indicator
        </label>

        <input
          type="text"
          placeholder="Typ een naam zoals BTC Change 24h of Price Trend..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
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

          {scoreRules.length > 0 ? (
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
          ) : (
            <p className="text-sm text-gray-500 italic">
              Geen scoreregels gevonden voor deze market-indicator.
            </p>
          )}

          {/* ➕ Add-knop */}
          <div className="pt-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Voeg toe aan market-analyse
            </button>

            {added && (
              <p className="text-green-600 text-sm mt-1">
                ✅ Indicator succesvol toegevoegd
              </p>
            )}
          </div>
        </div>
      )}

      {!selectedIndicator && (
        <p className="text-sm text-gray-500 italic">
          Typ en selecteer een indicator om de scoreregels te bekijken.
        </p>
      )}
    </CardWrapper>
  );
}
