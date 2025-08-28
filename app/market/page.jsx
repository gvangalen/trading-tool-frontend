'use client';

import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';

// 🔹 Dummy data voor forward return tabel
const dummyForwardReturnData = {
  week: [
    { start: '2025-08-21', end: '2025-08-28', change: 2.3, avgDaily: 0.33 },
    { start: '2025-08-14', end: '2025-08-21', change: -1.2, avgDaily: -0.17 },
  ],
  maand: [
    { start: '2025-07-28', end: '2025-08-28', change: 5.8, avgDaily: 0.19 },
  ],
  kwartaal: [
    { start: '2025-05-28', end: '2025-08-28', change: 12.1, avgDaily: 0.13 },
  ],
  jaar: [
    { start: '2024-08-28', end: '2025-08-28', change: 41.5, avgDaily: 0.11 },
  ]
};

export default function MarketPage() {
  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      {/* 🧠 Titel */}
      <h1 className="text-2xl font-bold">📊 Bitcoin Markt Overzicht</h1>

      {/* 💰 Live prijs en trend */}
      <MarketLiveCard />

      {/* 📆 Tabel met laatste 7 dagen */}
      <MarketSevenDayTable />

      {/* 📈 Forward return tabs (week/maand/kwartaal/jaar) */}
      <MarketForwardReturnTabs data={dummyForwardReturnData} />
    </div>
  );
}
