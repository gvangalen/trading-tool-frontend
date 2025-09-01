'use client';

import { useEffect, useState } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import { formatChange, formatNumber } from '@/components/market/utils';
import { fetchLatestBTC } from '@/lib/api/market';

export default function MarketLiveCard() {
  const [btc, setBtc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchLatestBTC();
      setBtc(data);
    } catch (err) {
      console.error("❌ Fout bij ophalen BTC:", err);
      setError('Fout bij ophalen BTC');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <CardWrapper><div className="p-4">📡 Laden...</div></CardWrapper>;
  if (error || !btc) return <CardWrapper><div className="p-4 text-red-600">❌ {error || 'Geen BTC data'}</div></CardWrapper>;

  return (
    <CardWrapper>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">🟢 Live BTC Prijs</h2>
        <div className="text-3xl font-mono">{formatNumber(btc.price, true)}</div>
        <div className="text-sm">
          📉 24u verandering: {formatChange(btc.change_24h)}
        </div>
        <div className="text-sm">
          📊 Volume: {formatNumber(btc.volume)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          ⏱ Laatste update: {btc.timestamp ? new Date(btc.timestamp).toLocaleTimeString() : '–'}
        </div>
      </div>
    </CardWrapper>
  );
}
