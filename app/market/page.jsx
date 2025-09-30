'use client';

import { useMarketData } from '@/hooks/useMarketData';
import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketPage() {
  const {
    loading,
    error,
    avgScore,
    advies,
    sevenDayData,
    btcLive,
    forwardReturns,
  } = useMarketData();

  const scoreColor = (score) => {
    if (score >= 1.5) return 'text-green-600';
    if (score <= -1.5) return 'text-red-600';
    return 'text-gray-600';
  };

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

      {/* 🔹 Score & Advies in Card */}
      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            📊 Markt Score:{' '}
            <span className={scoreColor(avgScore)}>{avgScore}</span>
          </h3>
          <h3 className="text-lg font-semibold">
            📈 Advies:{' '}
            <span className="text-blue-600">{advies}</span>
          </h3>
        </div>
      </CardWrapper>

      {/* 🔹 Live Prijs */}
      <MarketLiveCard
        price={btcLive?.price}
        change24h={btcLive?.change_24h}
        volume={btcLive?.volume}
        timestamp={btcLive?.timestamp}
      />

      {/* 🔹 Laatste 7 dagen */}
      <MarketSevenDayTable history={sevenDayData} />

      {/* 🔮 Forward Returns */}
      <MarketForwardReturnTabs data={forwardReturns} />
    </div>
  );
}
