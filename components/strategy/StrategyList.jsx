'use client';

import StrategyCard from '@/components/strategy/StrategyCard';

export default function StrategyList({
  strategies = [],
  searchTerm = '',
  onRefresh,
}) {

  // ---------------------------------------------------------
  // 🔍 Zoeken / filteren
  // ---------------------------------------------------------
  const filtered = strategies.filter((s) => {
    if (!s || !s.id) return false;

    const lower = searchTerm.toLowerCase();

    return (
      !searchTerm ||
      (s.symbol || '').toLowerCase().includes(lower) ||
      (s.tags || [])
        .map((t) => t.toLowerCase())
        .some((t) => t.includes(lower))
    );
  });

  // ---------------------------------------------------------
  // 🗂 Sorteren op nieuwste eerst
  // ---------------------------------------------------------
  const sortedStrategies = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="space-y-6">

      {sortedStrategies.length === 0 ? (
        <div className="text-center text-gray-500 pt-6">
          📭 Geen strategieën gevonden
        </div>
      ) : (
        sortedStrategies.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={s}
            onRefresh={onRefresh}
          />
        ))
      )}
    </div>
  );
}
