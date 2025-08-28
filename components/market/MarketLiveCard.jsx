'use client';

import { useMarketData } from '@/hooks/useMarketData';
import CardWrapper from '@/components/ui/CardWrapper';
import { formatChange, formatNumber } from '@/components/market/utils';

export default function MarketLiveCard() {
  const { marketData, loading, error } = useMarketData();

  // Alleen BTC tonen (of eerste asset als fallback)
  const btc = marketData.find(a => a.symbol === 'BTC') || marketData[0];

  if (loading) return <CardWrapper><div className="p-4">📡 Laden...</div></CardWrapper>;
  if (error) return <CardWrapper><div className="p-4 text-red-600">❌ Fout: {error}</div></CardWrapper>;
  if (!btc) return <CardWrapper><div className="p-4">⚠️ Geen BTC-data beschikbaar</div></CardWrapper>;

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
