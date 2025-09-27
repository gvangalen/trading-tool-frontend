'use client';

import { useMarketData } from '@/hooks/useMarketData';
import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';

export default function MarketSummaryForDashboard() {
  const { sevenDayData, btcLive } = useMarketData();

  return (
    <div className="space-y-4">
      <MarketLiveCard
        price={btcLive?.price}
        change24h={btcLive?.change_24h}
        volume={btcLive?.volume}
        timestamp={btcLive?.timestamp}
      />
      <MarketSevenDayTable history={sevenDayData} />
    </div>
  );
}
