'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AILoader from '@/components/ui/AILoader';

// ⬅️ BELANGRIJK: juiste functie importeren!
import { fetchLastStrategy } from '@/lib/api/strategy';

export default function TradingBotCard() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // -------------------------------------------------------------
  // Load last strategy (met veilige fallback)
  // -------------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchLastStrategy();

        // backend geeft direct strategy terug, niet {strategy: ...}
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
  // Render
  // -------------------------------------------------------------
  return (
    <Card className="bg-purple-100 dark:bg-purple-900 shadow-lg">
      <CardContent className="p-4">

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Bot className="text-purple-700 dark:text-purple-300 w-5 h-5" />
          <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
            AI TradingBot
          </span>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-4">
            <AILoader variant="dots" size="md" text="Strategy laden…" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && !strategy && (
          <p className="text-sm text-gray-800 dark:text-gray-200 italic">
            Nog geen strategie beschikbaar.
          </p>
        )}

        {/* Last strategy */}
        {!loading && strategy && (
          <div className="space-y-1 text-sm">
            <p className="text-gray-800 dark:text-gray-100">
              <strong>Setup:</strong> {strategy.setup_name || '-'}
            </p>

            <p className="text-gray-800 dark:text-gray-100">
              <strong>Type:</strong> {strategy.strategy_type || '-'}
            </p>

            <p className="text-gray-800 dark:text-gray-100">
              <strong>Asset:</strong> {strategy.symbol || '-'}
            </p>

            <p className="text-gray-800 dark:text-gray-100">
              <strong>Timeframe:</strong> {strategy.timeframe || '-'}
            </p>

            {strategy.entry && (
              <p className="text-gray-800 dark:text-gray-100">
                <strong>Entry:</strong> {strategy.entry}
              </p>
            )}

            {Array.isArray(strategy.targets) && strategy.targets.length > 0 && (
              <p className="text-gray-800 dark:text-gray-100">
                <strong>Targets:</strong> {strategy.targets.join(', ')}
              </p>
            )}

            {strategy.stop_loss && (
              <p className="text-gray-800 dark:text-gray-100">
                <strong>SL:</strong> {strategy.stop_loss}
              </p>
            )}

            {strategy.ai_explanation && (
              <p
                className="
                text-xs text-purple-800 dark:text-purple-200 
                italic mt-2 bg-purple-50/50 dark:bg-purple-900/30 
                p-2 rounded border border-purple-200/40 dark:border-purple-800
              "
              >
                🤖 {strategy.ai_explanation.slice(0, 140)}…
              </p>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
