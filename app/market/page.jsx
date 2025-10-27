'use client';

import { useMarketData } from '@/hooks/useMarketData';
import { useScoresData } from '@/hooks/useScoresData';
import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketPage() {
  const { btcLive, sevenDayData, forwardReturns } = useMarketData();
  const { market, loading, error } = useScoresData();

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score <= 25) return 'text-red-600';
    return 'text-gray-600';
  };

  const adviesText =
    market.score >= 75
      ? '📈 Bullish'
      : market.score <= 25
      ? '📉 Bearish'
      : '⚖️ Neutraal';

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🔹 Titel */}
      <h1 className="text-2xl font-bold">📊 Bitcoin Markt Overzicht</h1>

      {loading && (
        <p className="text-sm text-gray-500">📡 Gegevens worden geladen...</p>
      )}
      {error && (
        <p className="text-sm text-red-500">❌ {error}</p>
      )}

      {/* ✅ Markt Score */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            📊 Markt Score:{' '}
            <span className={scoreColor(market?.score)}>
              {loading ? '⏳' : market?.score?.toFixed(1) ?? '–'}
            </span>
          </h3>
          <h3 className="text-lg font-semibold">
            📈 Advies:{' '}
            <span className="text-blue-600">
              {loading ? '⏳' : adviesText}
            </span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Live BTC info */}
      <MarketLiveCard
        price={btcLive?.price}
        change24h={btcLive?.change_24h}
        volume={btcLive?.volume}
        timestamp={btcLive?.timestamp}
      />

      {/* 🔹 Tabel 7 dagen */}
      <MarketSevenDayTable history={sevenDayData} />

      {/* 🔮 Forward returns tabs */}
      <MarketForwardReturnTabs data={forwardReturns} />
    </div>
  );
}
