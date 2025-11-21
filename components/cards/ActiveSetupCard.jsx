'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { fetchLastSetup } from '@/lib/api/setups'; // <-- Nieuwe API call nodig!

export default function ActiveSetupCard() {
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Load nieuwste setup
  // --------------------------------
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

  // --------------------------------
  // Trend styling
  // --------------------------------
  const trend = setup?.trend || 'neutral';
  const trendClass =
    trend.toLowerCase() === 'bullish'
      ? 'border-green-600 bg-green-50 dark:bg-green-900 dark:border-green-700'
      : trend.toLowerCase() === 'bearish'
      ? 'border-red-600 bg-red-50 dark:bg-red-900 dark:border-red-700'
      : 'border-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-600';

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <Card className={`shadow-sm ${trendClass}`}>
      <CardContent className="p-4">

        {/* Titel */}
        <div className="flex items-center gap-2 mb-1 font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Actieve Setup</span>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-sm text-gray-500 italic">⏳ Laden…</p>
        ) : !setup ? (
          <p className="text-sm text-gray-500 italic">Geen actieve setup gevonden.</p>
        ) : (
          <div className="text-sm text-gray-800 dark:text-gray-100 space-y-1">

            <p>
              <strong>Naam:</strong> {setup.name}
            </p>

            <p>
              <strong>Trend:</strong> {setup.trend || '-'}
            </p>

            <p>
              <strong>Timeframe:</strong> {setup.timeframe}
            </p>

            <p>
              <strong>Type:</strong> {setup.strategy_type}
            </p>

            <p>
              <strong>Asset:</strong> {setup.symbol}
            </p>

            <p className="text-xs mt-2 italic text-gray-600 dark:text-gray-300">
              Klik voor details op de setups-pagina.
            </p>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
