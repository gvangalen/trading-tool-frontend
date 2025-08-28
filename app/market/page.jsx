'use client';

import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';

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
      <MarketForwardReturnTabs />
    </div>
  );
}
