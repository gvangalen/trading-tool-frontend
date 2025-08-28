'use client';

import { useMarketData } from '@/hooks/useMarketData';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketLiveCard() {
  const { marketData, loading, error } = useMarketData();

  // Alleen BTC tonen (of eerste asset)
  const btc = marketData.find(a => a.symbol === 'BTC') || marketData[0];

  if (loading) return <CardWrapper><div className="p-4">📡 Laden...</div></CardWrapper>;
  if (error) return <CardWrapper><div className="p-4 text-red-600">❌ Fout: {error}</div></CardWrapper>;
  if (!btc) return <CardWrapper><div className="p-4">⚠️ Geen BTC-data beschikbaar</div></CardWrapper>;

  const color = btc.change_24h >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <CardWrapper>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">🟢 Live BTC Prijs</h2>
        <div className="text-3xl font-mono">${btc.price?.toFixed(2) ?? '–'}</div>
        <div className="text-sm">
          📉 24u verandering: <span className={color}>{btc.change_24h?.toFixed(2)}%</span>
        </div>
        <div className="text-sm">
          📊 Volume: {btc.volume?.toLocaleString() ?? '–'}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          ⏱ Laatste update: {btc.timestamp ? new Date(btc.timestamp).toLocaleTimeString() : '–'}
        </div>
      </div>
    </CardWrapper>
  );
}
