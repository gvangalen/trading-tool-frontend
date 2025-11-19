'use client';

import { useState, useEffect } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import StrategyCard from '@/components/strategy/StrategyCard';

export default function StrategyList({ searchTerm = '' }) {
  const { strategies, loadStrategies } = useStrategyData();
  const [sort, setSort] = useState('created_at');
  const [filters, setFilters] = useState({ symbol: '', timeframe: '', tag: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadStrategies().catch((err) => {
      console.error('❌ Fout bij laden strategieën:', err);
    });
  }, [loadStrategies]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // === OPTIE B: de callback vanuit StrategyCard ===
  const handleUpdated = async (deletedIdOrStrategy) => {
    // DELETE => StrategyCard geeft ID terug
    if (typeof deletedIdOrStrategy === 'number') {
      console.log("🗑 ID uit StrategyCard:", deletedIdOrStrategy);
      setStrategies((prev) => prev.filter((s) => s.id !== deletedIdOrStrategy));
      showToast('🗑️ Strategie verwijderd!');
      return;
    }

    // UPDATE of AI GENERATED => StrategyCard geeft strategy data terug
    if (typeof deletedIdOrStrategy === 'object') {
      await loadStrategies();
      showToast('♻️ Strategie bijgewerkt!');
      return;
    }

    // fallback
    await loadStrategies();
  };

  // === FILTERS ===
  const filtered = strategies
    .filter((s) => s && s.id)
    .filter((s) => {
      const matchesSymbol = !filters.symbol || s.symbol === filters.symbol;
      const matchesTimeframe = !filters.timeframe || s.timeframe === filters.timeframe;
      const matchesTag = !filters.tag || (s.tags || []).includes(filters.tag);

      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (s.symbol || '').toLowerCase().includes(lowerSearch) ||
        (s.tags || [])
          .map((t) => t.toLowerCase())
          .some((t) => t.includes(lowerSearch));

      return matchesSymbol && matchesTimeframe && matchesTag && matchesSearch;
    });

  // === SORT ===
  const sortedStrategies = [...filtered].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favorite') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6">

      {/* FILTERS */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <select
            value={filters.symbol}
            onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Symbol</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>

          <select
            value={filters.timeframe}
            onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Timeframe</option>
            <option value="1D">1D</option>
            <option value="4H">4H</option>
          </select>

          <select
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Tag</option>
            <option value="breakout">Breakout</option>
            <option value="retracement">Retracement</option>
          </select>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="created_at">📅 Laatste</option>
          <option value="score">📈 Score</option>
          <option value="favorite">⭐ Favoriet</option>
        </select>
      </div>

      {/* STRATEGY CARDS */}
      {sortedStrategies.length === 0 ? (
        <div className="text-center text-gray-500 pt-6">
          📭 Geen strategieën gevonden
        </div>
      ) : (
        sortedStrategies.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={s}
            onUpdated={handleUpdated}   // 🔥 Belangrijk
          />
        ))
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
