'use client';

import MarketLiveCard from './MarketLiveCard';
import MarketSevenDayTable from './MarketSevenDayTable';

export default function MarketSummaryForDashboard() {
  return (
    <div className="space-y-4">
      <MarketLiveCard />
      <MarketSevenDayTable />
    </div>
  );
}
