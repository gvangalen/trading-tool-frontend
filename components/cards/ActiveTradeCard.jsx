'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { fetchLastStrategy } from '@/lib/api/strategy';

export default function ActiveTradeCard() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchLastStrategy();
      setStrategy(data || null);
    } catch (e) {
      console.error('❌ ActiveTradeCard: Fout bij ophalen laatste strategie', e);
      setStrategy(null);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // 🎨 Trend kleur logica
  // -------------------------------
  const trend = strategy?.trend || 'neutral';
  const trendClass =
    trend.toLowerCase() === 'bullish'
      ? 'border-green-600 bg-green-50 dark:bg-green-900 dark:border-green-700'
      : trend.toLowerCase() === 'bearish'
      ? 'border-red-600 bg-red-50 dark:bg-red-900 dark:border-red-700'
      : 'border-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-600';

  // -------------------------------
  // 🧮 Entry formatter (geen NaN)
  // -------------------------------
  function formatNumber(value) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') return value.toLocaleString();
    if (!isNaN(Number(value))) return Number(value).toLocaleString();
    return value; // fallback: raw string
  }

  const entryDisplay = formatNumber(strategy?.entry);
  const stopDisplay = formatNumber(strategy?.stop_loss);

  const targetsDisplay =
    Array.isArray(strategy?.targets) && strategy.targets.length > 0
      ? strategy.targets.map(formatNumber).join(' / ')
      : '-';

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <Card className={`shadow-sm ${trendClass}`}>
      <CardContent className="p-4">
        
        {/* Titel */}
        <div className="flex items-center gap-2 mb-1 font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Actieve Strategie</span>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-sm text-gray-500 italic">⏳ Laden...</p>
        ) : !strategy ? (
          <p className="text-sm text-gray-500 italic">Geen strategie beschikbaar.</p>
        ) : (
          <div className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
            <p><strong>Setup:</strong> {strategy.setup_name || '-'}</p>
            <p><strong>Trend:</strong> {strategy.trend || '-'}</p>

            <p>
              <strong>Entry:</strong> ${entryDisplay}
            </p>

            <p>
              <strong>Targets:</strong> {targetsDisplay}
            </p>

            <p>
              <strong>Stop:</strong> {stopDisplay}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
