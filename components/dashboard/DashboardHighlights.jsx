'use client';

import ReportCard from '@/components/cards/ReportCard';
import ActiveTradeCard from '@/components/cards/ActiveTradeCard';
import MasterScoreCard from '@/components/cards/MasterScoreCard';
import TradingBotCard from '@/components/cards/TradingBotCard';

export default function DashboardHighlights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportCard />
      <ActiveTradeCard />
      <MasterScoreCard />
      <TradingBotCard />
    </div>
  );
}
