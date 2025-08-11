'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

export default function TopSetupsMini() {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendFilter, setTrendFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadTopSetups();

    // ⏱️ Auto-refresh elke 60 sec
    const interval = setInterval(() => loadTopSetups(), 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadTopSetups() {
    try {
      setLoading(true);
      let res;

      try {
        res = await fetch(`${API_BASE_URL}/api/setups/top?limit=10`);
        if (!res.ok) throw new Error('Top setups endpoint faalt');
      } catch {
        console.warn('⚠️ /api/setups/top faalt, fallback naar /api/setups');
        res = await fetch(`${API_BASE_URL}/api/setups`);
        if (!res.ok) throw new Error('Fallback endpoint faalt ook');
      }

      const data = await res.json();

      const setups = Array.isArray(data)
        ? data
        : Array.isArray(data.setups)
        ? data.setups
        : [];

      const sorted = setups
        .filter((s) => typeof s.score === 'number')
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setTopSetups(sorted);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Fout bij laden setups:', error);
      setTopSetups([
        {
          id: 'fallback', // string ID, let op consistentie met backend data
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

  // Filter op trend en top 3 per filter
  const filteredSetups = topSetups
    .filter((s) => trendFilter === 'all' || s.trend === trendFilter)
    .slice(0, 3);

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
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">🏆 Top Setups</h4>
        {lastUpdated && (
          <span className="text-xs text-gray-500 italic">
            Laatst geüpdatet: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* 🔍 Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="trendFilter" className="text-xs">
          Filter:
        </label>
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

      {/* 📋 Setups */}
      <ul className="list-disc list-inside space-y-1">
        {filteredSetups.length === 0 ? (
          <li className="text-gray-400">Geen setups voor deze trend.</li>
        ) : (
          filteredSetups.map((setup) => {
            const trendIcon =
              setup.trend === 'bullish'
                ? '📈'
                : setup.trend === 'bearish'
                ? '📉'
                : '⚖️';

            const scoreColor =
              setup.score >= 2
                ? 'text-green-600'
                : setup.score <= -2
                ? 'text-red-600'
                : 'text-gray-600';

            // Veilig eerste indicator pakken
            const firstIndicator =
              typeof setup.indicators === 'string' && setup.indicators.length > 0
                ? setup.indicators.split(',')[0]
                : '-';

            return (
              <li key={setup.id} className="hover:bg-gray-50 rounded px-1 py-1">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{setup.name}</strong> {trendIcon}
                    <span
                      className="ml-2 text-xs text-gray-500"
                      title={`Indicators: ${setup.indicators || '-'}`}
                    >
                      🧠 {firstIndicator}
                    </span>
                  </div>
                  <span className={`font-semibold ${scoreColor}`}>
                    {setup.score?.toFixed(1) ?? '-'}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
