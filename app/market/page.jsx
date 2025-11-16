'use client';

import { useMarketData } from '@/hooks/useMarketData';
import { useScoresData } from '@/hooks/useScoresData';

import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';
import CardWrapper from '@/components/ui/CardWrapper';

import MarketIndicatorScoreView from '@/components/market/MarketIndicatorScoreView';
import MarketDayTable from '@/components/market/MarketDayTable';

export default function MarketPage() {
  const {
    btcLive,
    sevenDayData,
    forwardReturns,

    marketIndicators,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,

    addMarket,     // 🟢 via hook
    removeMarket,  // 🟢 via hook

    loading,
    error,
  } = useMarketData();

  const { market } = useScoresData();

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score <= 25) return 'text-red-600';
    return 'text-gray-600';
  };

  const adviesText =
    market.score >= 75 ? '📈 Bullish'
      : market.score <= 25 ? '📉 Bearish'
      : '⚖️ Neutraal';

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">

      {/* Titel */}
      <h1 className="text-2xl font-bold">📊 Bitcoin Markt Overzicht</h1>

      {loading && <p className="text-sm text-gray-500">📡 Laden...</p>}
      {error && <p className="text-sm text-red-500">❌ {error}</p>}


      {/* ================================
          🔥 MARKET SCORE
      ================================= */}
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
            <span className="text-blue-600">{loading ? '⏳' : adviesText}</span>
          </h3>
        </div>
      </CardWrapper>


      {/* ================================
          🔥 LIVE BTC DATA
      ================================= */}
      <MarketLiveCard
        price={btcLive?.price}
        change24h={btcLive?.change_24h}
        volume={btcLive?.volume}
        timestamp={btcLive?.timestamp}
      />


      {/* ================================
          🔥 SCORE LOGICA (ZOEK + VIEW + ADD)
      ================================= */}
      <MarketIndicatorScoreView
        availableIndicators={availableIndicators}
        selectedIndicator={selectedIndicator}
        scoreRules={scoreRules}
        selectIndicator={selectIndicator}
        addMarketIndicator={addMarket}   // 🟢 Correct
      />


      {/* ================================
          🔥 MARKET DAY TABLE
      ================================= */}
      <CardWrapper title="📅 Dagelijkse Market Analyse">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="p-2">Indicator</th>
              <th className="p-2 text-center">Value</th>
              <th className="p-2 text-center">Score</th>
              <th className="p-2 text-center">Actie</th>
              <th className="p-2">Uitleg</th>
              <th className="p-2 text-center">❌</th>
            </tr>
          </thead>

          <tbody>
            <MarketDayTable
              data={marketIndicators}
              onRemove={removeMarket}   // 🟢 Correct
            />
          </tbody>
        </table>
      </CardWrapper>


      {/* ================================
          🔥 7-DAY HISTORY
      ================================= */}
      <MarketSevenDayTable history={sevenDayData} />


      {/* ================================
          🔥 FORWARD RETURNS
      ================================= */}
      <MarketForwardReturnTabs data={forwardReturns} />

    </div>
  );
}
