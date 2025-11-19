'use client';

import { useState, useEffect } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import StrategyCard from '@/components/strategy/StrategyCard';

export default function StrategyList({ searchTerm = '' }) {
  const { strategies, loadStrategies } = useStrategyData();
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

  // === UPDATE / DELETE callback ===
  const handleUpdated = async () => {
    await loadStrategies();
    showToast('♻️ Strategie bijgewerkt!');
  };

  // === Alleen zoeken ===
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

  // === Sorteer altijd op nieuwste eerst ===
  const sortedStrategies = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="space-y-6">

      {/* Geen sorteer-opties meer */}

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
            onUpdated={handleUpdated}
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
