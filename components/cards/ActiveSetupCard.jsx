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

  const trend = setup?.trend || 'neutral';
  const trendClass =
    trend.toLowerCase() === 'bullish'
      ? 'border-green-500 bg-green-50 dark:bg-green-900'
      : trend.toLowerCase() === 'bearish'
      ? 'border-red-500 bg-red-50 dark:bg-red-900'
      : 'border-gray-300 bg-gray-50 dark:bg-gray-800';

  return (
    <CardWrapper>
      <div className={`rounded-xl p-4 border ${trendClass}`}>

        {/* Titel */}
        <div className="flex items-center gap-2 mb-2 font-semibold text-[var(--text-dark)]">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Actieve Setup</span>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-sm text-gray-500 italic">⏳ Laden…</p>
        ) : !setup ? (
          <p className="text-sm text-gray-500 italic">Geen actieve setup gevonden.</p>
        ) : (
          <div className="text-sm text-[var(--text-dark)] space-y-1">

            <p><strong>Naam:</strong> {setup.name}</p>
            <p><strong>Trend:</strong> {setup.trend || '-'}</p>
            <p><strong>Timeframe:</strong> {setup.timeframe}</p>
            <p><strong>Type:</strong> {setup.strategy_type}</p>
            <p><strong>Asset:</strong> {setup.symbol}</p>

            <p className="text-xs mt-2 italic text-[var(--text-light)]">
              Klik voor details op de setups-pagina.
            </p>

          </div>
        )}
      </div>
    </CardWrapper>
  );
}
