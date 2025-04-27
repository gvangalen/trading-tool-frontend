'use client';

import { useState, useEffect } from 'react';

export default function TopSetupsMini() {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendFilter, setTrendFilter] = useState('all');

  useEffect(() => {
    loadTopSetups();
  }, []);

  async function loadTopSetups() {
    try {
      let res = await fetch('/api/setups/top3');
      if (!res.ok) {
        console.warn('⚠️ /api/setups/top3 niet beschikbaar, fallback naar /api/setups');
        res = await fetch('/api/setups');
      }
      const data = await res.json();
      const sorted = (data || [])
        .filter(s => typeof s.score === 'number')
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // iets ruimer voor filtering

      setTopSetups(sorted);
    } catch (error) {
      console.error('❌ Fout bij laden top setups:', error);
      setTopSetups([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredSetups = topSetups.filter(setup => {
    if (trendFilter === 'all') return true;
    return setup.trend === trendFilter;
  }).slice(0, 3); // top 3 per filter

  if (loading) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        📡 Setups laden...
      </div>
    );
  }

  if (topSetups.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        ⚠️ Geen actieve setups gevonden.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left text-sm">
      <h4 className="font-semibold mb-2">🏆 Top Setups:</h4>

      {/* 🔹 Trend Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="trendFilter" className="text-xs">🔍 Filter:</label>
        <select
          id="trendFilter"
          value={trendFilter}
          onChange={(e) => setTrendFilter(e.target.value)}
          className="border p-1 rounded text-xs"
        >
          <option value="all">🔁 Alle</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>
      </div>

      {/* 🔹 Top Setups List */}
      <ul className="list-disc list-inside space-y-1">
        {filteredSetups.length === 0 ? (
          <li className="text-gray-400">Geen setups gevonden voor deze trend.</li>
        ) : (
          filteredSetups.map((setup) => {
            const trendIcon =
              setup.trend === 'bullish' ? '📈' :
              setup.trend === 'bearish' ? '📉' :
              '⚖️';

            const scoreColor =
              setup.score >= 2 ? 'text-green-600' :
              setup.score <= -2 ? 'text-red-600' :
              'text-gray-600';

            return (
              <li key={setup.id}>
                <strong>{setup.name}</strong> {trendIcon} ({setup.indicators}) — 
                <span className={`ml-1 font-semibold ${scoreColor}`}>
                  Score: {setup.score?.toFixed(1) ?? '-'}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
