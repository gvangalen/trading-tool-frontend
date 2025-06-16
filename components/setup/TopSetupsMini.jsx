'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

export default function TopSetupsMini() {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendFilter, setTrendFilter] = useState('all');

  useEffect(() => {
    loadTopSetups();
  }, []);

  async function loadTopSetups() {
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/setups/top?limit=10`);
        if (!res.ok) throw new Error('Top setups endpoint faalt');
      } catch {
        console.warn('⚠️ /api/setups/top faalt, fallback naar /api/setups');
        res = await fetch(`${API_BASE_URL}/api/setups`);
      }

      const data = await res.json();

      const setups = Array.isArray(data)
        ? data
        : Array.isArray(data.setups)
        ? data.setups
        : [];

      const sorted = setups
        .filter(s => typeof s.score === 'number')
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setTopSetups(sorted);
    } catch (error) {
      console.error('❌ Fout bij laden setups:', error);
      setTopSetups([
        {
          id: 'fallback',
          name: 'Voorbeeld Setup',
          trend: 'neutral',
          indicators: 'RSI, Volume',
          score: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filteredSetups = topSetups
    .filter(s => trendFilter === 'all' || s.trend === trendFilter)
    .slice(0, 3); // Top 3 per filter

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

      {/* 🔹 Filter */}
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

      {/* 🔹 Setups */}
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
                <strong>{setup.name}</strong> {trendIcon}{' '}
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
