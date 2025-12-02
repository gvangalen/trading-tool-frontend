'use client';

import { useState, useEffect } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import StrategyCard from '@/components/strategy/StrategyCard';
import { useModal } from "@/components/modal/ModalProvider";

export default function StrategyList({ searchTerm = '' }) {
  const { strategies, loadStrategies } = useStrategyData();
  const { showSnackbar } = useModal(); // ✅ Nieuwe snackbar
  const [initialized, setInitialized] = useState(false);

  // ---------------------------------------------------------
  // 🔄 Load strategies bij eerste render
  // ---------------------------------------------------------
  useEffect(() => {
    loadStrategies()
      .catch((err) =>
        console.error('❌ Fout bij laden strategieën:', err)
      )
      .finally(() => setInitialized(true));
  }, []); // ← géén dependencies → voorkomt loops

  // ---------------------------------------------------------
  // ♻️ Reload na update/delete (via StrategyCard)
  // ---------------------------------------------------------
  const handleUpdated = async () => {
    await loadStrategies();
    showSnackbar("Strategie bijgewerkt!", "success"); // ✅ Snack i.p.v. toast
  };

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

      {/* Geen resultaten */}
      {initialized && sortedStrategies.length === 0 ? (
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

      {/* ❗ Geen toast meer! Nieuwe snackbar wordt via ModalProvider getoond */}
    </div>
  );
}
