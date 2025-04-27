'use client';

import { useState, useEffect } from 'react';

export default function TopSetupsMini() {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const sorted = [...data]
        .filter(s => s.score !== undefined)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setTopSetups(sorted);
    } catch (error) {
      console.error('❌ Fout bij laden top setups:', error);
      setTopSetups([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500 text-sm">📡 Setups laden...</div>;
  }

  if (topSetups.length === 0) {
    return <div className="text-gray-500 text-sm">⚠️ Geen actieve setups gevonden.</div>;
  }

  return (
    <div className="space-y-2 text-left text-sm">
      <h4 className="font-semibold">🏆 Top Setups:</h4>
      <ul className="list-disc list-inside space-y-1">
        {topSetups.map((setup) => {
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
                Score: {setup.score.toFixed(1)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
