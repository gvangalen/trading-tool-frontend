'use client';

import { useMarketData } from '@/hooks/useMarketData';
import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';

// 🔁 Dummy forward return data
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

export default function MarketPage() {
  const {
    marketData,
    loading,
    error,
    avgScore,
    advies,
    sevenDayData,
  } = useMarketData();

  console.group('📊 [MarketPage] Render gestart');
  console.log('🔁 loading:', loading);
  console.log('❌ error:', error);
  console.log('📊 marketData:', marketData);
  console.log('📅 sevenDayData:', sevenDayData);
  console.log('📈 avgScore:', avgScore);
  console.log('🧠 advies:', advies);
  console.groupEnd();

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Bitcoin Markt Overzicht</h1>

      {loading && (
        <p className="text-sm text-gray-500">📡 Gegevens worden geladen...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">❌ {error}</p>
      )}

      {/* ✅ Altijd tonen – zelfs als loading/error actief is */}
      <div className="space-y-6 mt-4">
        {/* 🔹 Markt Score */}
        <div className="text-sm text-gray-700">
          Markt Score: <strong>{avgScore}</strong> | Advies:{' '}
          <strong>{advies}</strong>
        </div>

        {/* 💰 Live BTC Prijs via API */}
        <MarketLiveCard />

        {/* 📅 Laatste 7 dagen prijs en volume */}
        <MarketSevenDayTable history={sevenDayData} />

        {/* 🔮 Forward return voorspelling */}
        <MarketForwardReturnTabs data={dummyForwardReturnData} />
      </div>
    </div>
  );
}
