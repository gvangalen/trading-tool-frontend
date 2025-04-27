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
      const res = await fetch('/api/setups/top3');
      const data = await res.json();
      setTopSetups(data || []);
    } catch (error) {
      console.error('❌ Error loading top setups:', error);
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
        {topSetups.map((setup) => (
          <li key={setup.id}>
            <strong>{setup.name}</strong> — {setup.trend === 'bullish' ? '📈' : setup.trend === 'bearish' ? '📉' : '⚖️'} ({setup.indicators})
          </li>
        ))}
      </ul>
    </div>
  );
}
