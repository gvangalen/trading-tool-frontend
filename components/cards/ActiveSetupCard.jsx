'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { fetchLastSetup } from '@/lib/api/setups';
import CardWrapper from '@/components/ui/CardWrapper';

export default function ActiveSetupCard() {
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchLastSetup();
      setSetup(data || null);
    } catch (err) {
      console.error('❌ ActiveSetupCard: fout bij ophalen laatste setup', err);
      setSetup(null);
    } finally {
      setLoading(false);
    }
  }

  // 🎨 Trendkleur
  const trend = setup?.trend?.toLowerCase() || 'neutral';

  const trendClasses = {
    bullish: "bg-green-100/60 dark:bg-green-900/40 border-green-300/60 dark:border-green-800",
    bearish: "bg-red-100/60 dark:bg-red-900/40 border-red-300/60 dark:border-red-800",
    neutral: "bg-gray-100/60 dark:bg-gray-900/40 border-gray-300/60 dark:border-gray-800",
  };

  const boxClass = trendClasses[trend] || trendClasses.neutral;

  return (
    <CardWrapper title="Actieve Setup">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg shadow-sm ${boxClass}`}>
          <TrendingUp className="w-5 h-5 text-[var(--text-dark)] dark:text-[var(--text-light)]" />
        </div>

        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          Huidige Setup Status
        </h2>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-[var(--text-light)] italic py-2">
          ⏳ Laden…
        </p>
      )}

      {/* EMPTY */}
      {!loading && !setup && (
        <p className="text-sm italic text-[var(--text-light)] py-2">
          Geen actieve setup gevonden.
        </p>
      )}

      {/* DATA WEERGAVE */}
      {!loading && setup && (
        <div className="space-y-1.5 text-sm text-[var(--text-dark)]">

          <p><strong>Naam:</strong> {setup.name || "–"}</p>
          <p><strong>Trend:</strong> {setup.trend || "–"}</p>
          <p><strong>Timeframe:</strong> {setup.timeframe || "–"}</p>
          <p><strong>Type:</strong> {setup.strategy_type || "–"}</p>
          <p><strong>Asset:</strong> {setup.symbol || "–"}</p>

          <p className="text-xs italic mt-3 text-[var(--text-light)]">
            Bekijk details op de setups-pagina.
          </p>
        </div>
      )}

    </CardWrapper>
  );
}
