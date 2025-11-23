'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import CardWrapper from '@/components/ui/CardWrapper';
import AILoader from '@/components/ui/AILoader';
import { fetchLastStrategy } from '@/lib/api/strategy';

export default function TradingBotCard() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // -------------------------------------------------------------
  // Load last strategy
  // -------------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchLastStrategy();

        if (data && typeof data === 'object' && !data.message) {
          setStrategy(data);
        } else {
          setStrategy(null);
        }

      } catch (err) {
        console.error('❌ Fout bij ophalen laatste strategy:', err);
        setError('Kan laatste strategy niet laden');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <CardWrapper title="AI TradingBot">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3 mt-1">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 shadow-sm">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>

        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          Laatste Strategie
        </h2>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-4">
          <AILoader variant="dots" size="md" text="Strategy laden…" />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && !error && !strategy && (
        <p className="text-sm italic text-[var(--text-light)]">
          Nog geen strategie beschikbaar.
        </p>
      )}

      {/* STRATEGY INFO */}
      {!loading && strategy && (
        <div className="space-y-[6px] text-sm text-[var(--text-dark)]">

          <p><strong>Setup:</strong> {strategy.setup_name || '-'}</p>
          <p><strong>Type:</strong> {strategy.strategy_type || '-'}</p>
          <p><strong>Asset:</strong> {strategy.symbol || '-'}</p>
          <p><strong>Timeframe:</strong> {strategy.timeframe || '-'}</p>

          {strategy.entry && (
            <p><strong>Entry:</strong> {strategy.entry}</p>
          )}

          {Array.isArray(strategy.targets) && strategy.targets.length > 0 && (
            <p><strong>Targets:</strong> {strategy.targets.join(', ')}</p>
          )}

          {strategy.stop_loss && (
            <p><strong>SL:</strong> {strategy.stop_loss}</p>
          )}

          {/* AI-UITLEG met LUCIde ICON + line-clamp */}
          {strategy.ai_explanation && (
            <div
              className="
                text-xs italic mt-2 p-2 rounded-lg
                bg-purple-100/60 dark:bg-purple-900/40
                text-purple-700 dark:text-purple-200
                border border-purple-200/40 dark:border-purple-800
                flex items-start gap-2
                line-clamp-3
              "
            >
              <Bot className="w-4 h-4 mt-[2px] flex-shrink-0 text-purple-600 dark:text-purple-300" />
              <span>{strategy.ai_explanation}</span>
            </div>
          )}
        </div>
      )}

    </CardWrapper>
  );
}
