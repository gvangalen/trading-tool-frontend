'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

export default function TradingAdvice() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvice();
  }, []);

  async function fetchAdvice() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trading/trading_advice?symbol=BTC`);
      if (!res.ok) throw new Error('Response niet OK');
      const data = await res.json();

      if (!data || typeof data !== 'object') throw new Error('Ongeldig advies-object');

      setAdvice(data);
    } catch (err) {
      console.error('❌ Fout bij ophalen tradingadvies:', err);
      setAdvice({
        setup: '-',
        trend: 'Neutraal',
        entry: 0,
        targets: [],
        stop_loss: '-',
        risico: '-',
        reden: 'Geen advies beschikbaar.',
      });
    } finally {
      setLoading(false);
    }
  }

  const trendColor =
    advice?.trend === 'Bullish'
      ? 'border-green-600 bg-green-100 text-green-800'
      : advice?.trend === 'Bearish'
      ? 'border-red-600 bg-red-100 text-red-800'
      : 'border-gray-400 bg-gray-100 text-gray-700';

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${trendColor}`}>
      <h3 className="text-lg font-semibold mb-2">🚀 Actueel Tradingadvies (Bitcoin)</h3>

      {loading ? (
        <div className="text-sm italic text-gray-500">📡 Advies wordt geladen...</div>
      ) : (
        <>
          <p><strong>📋 Setup:</strong> {advice?.setup ?? '-'}</p>
          <p><strong>📈 Trend:</strong> {advice?.trend ?? '-'}</p>
          <p><strong>🎯 Entry:</strong> ${Number(advice?.entry ?? 0).toFixed(2)}</p>
          <p>
            <strong>🎯 Targets:</strong>{' '}
            {Array.isArray(advice?.targets) && advice.targets.length > 0
              ? advice.targets
                  .map((t) =>
                    typeof t === 'object' && t.price && t.type
                      ? `${t.type}: $${t.price}`
                      : `$${t}`
                  )
                  .join(' / ')
              : '-'}
          </p>
          <p><strong>🛑 Stop-loss:</strong> {advice?.stop_loss ?? '-'}</p>
          <p><strong>⚠️ Risico:</strong> {advice?.risico ?? '-'}</p>
          {advice?.reden && (
            <p className="text-sm italic text-gray-600 mt-2">{advice.reden}</p>
          )}
        </>
      )}
    </div>
  );
}
