'use client';

import { useMarketData } from '@/hooks/useMarketData';
import CardWrapper from '@/components/ui/CardWrapper';
import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';

// ✅ Correct dummy forward return data structure
const dummyForwardReturnData = {
  maand: [
    {
      year: 2023,
      values: [1.2, -0.4, 0.8, 2.1, 0.3, -0.9, 1.0, 2.5, 0.4, -0.2, 1.1, 0.7],
    },
    {
      year: 2024,
      values: [1.8, -0.6, 1.0, 1.5, 0.6, -1.2, 1.3, 2.1, 0.2, -0.5, 1.0, 0.6],
    },
  ],
  kwartaal: [],
  jaar: [],
  week: [],
};

// ✅ (optioneel) fallback BTC voor demo / debugging
const fallbackBTC = {
  symbol: 'BTC',
  price: 65000,
  change_24h: 2.5,
  volume: 32000000000,
  timestamp: new Date().toISOString(),
};

export default function MarketPage() {
  const {
    marketData,
    loading,
    error,
    avgScore,
    advies,
    sevenDayData,
  } = useMarketData();

  // 🔍 BTC uit marktdata ophalen (met fallback mogelijk)
  const btc = marketData.find((item) => item.symbol === 'BTC');
  // const btc = marketData.find((item) => item.symbol === 'BTC') ?? fallbackBTC;

  // ✅ Debug logging (verwijder in productie)
  console.log('✅ marketData:', marketData);
  console.log('🔍 btc:', btc);
  console.log('📅 sevenDayData:', sevenDayData);
  console.log('📈 dummyForwardReturnData:', dummyForwardReturnData);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Bitcoin Markt Overzicht</h1>

      {loading && (
        <p className="text-sm text-gray-500">📡 Gegevens worden geladen...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">❌ {error}</p>
      )}

      {!loading && !error && btc && (
        <>
          {/* 🔹 Markt Score */}
          <div className="text-sm text-gray-700">
            Markt Score: <strong>{avgScore}</strong> | Advies:{' '}
            <strong>{advies}</strong>
          </div>

          {/* 💰 Live prijs en trend */}
          <MarketLiveCard
            price={btc.price}
            change24h={btc.change_24h}
            volume={btc.volume}
            timestamp={btc.timestamp}
          />

          {/* 📆 7-daagse prijsgeschiedenis */}
          <MarketSevenDayTable history={sevenDayData} />

          {/* 🔮 Forward return voorspelling (dummy voorlopig) */}
          <MarketForwardReturnTabs data={dummyForwardReturnData} />
        </>
      )}

      {!loading && !error && !btc && (
        <p className="text-sm text-yellow-600">
          ⚠️ Geen BTC-data gevonden in marketData
        </p>
      )}
    </div>
  );
}
