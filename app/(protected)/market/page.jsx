"use client";

import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Gauge,
  Info,
  Activity,
} from "lucide-react";

// Hooks
import { useMarketData } from "@/hooks/useMarketData";
import { useScoresData } from "@/hooks/useScoresData";

// Shared Components
import CardWrapper from "@/components/ui/CardWrapper";
import DayTable from "@/components/ui/DayTable";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

// Market Components
import MarketLiveCard from "@/components/market/MarketLiveCard";
import MarketSevenDayTable from "@/components/market/MarketSevenDayTable";
import MarketForwardReturnTabs from "@/components/market/MarketForwardReturnTabs";
import MarketIndicatorScoreView from "@/components/market/MarketIndicatorScoreView";

export default function MarketPage() {
  const {
    btcLive,
    sevenDayData,
    forwardReturns,
    marketDayData,
    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
    addMarket,
    removeMarket,
    loading,
    error,
  } = useMarketData();

  const { market } = useScoresData();

  /* ---------------------------------------------------------
     SAFE FALLBACKS
  --------------------------------------------------------- */

  const safeMarketScore =
    typeof market?.score === "number" ? market.score : null;

  const safeLive = btcLive || {};
  const safeMarketDayData = Array.isArray(marketDayData)
    ? marketDayData
    : [];
  const safeSevenDay = Array.isArray(sevenDayData) ? sevenDayData : [];
  const safeForward = Array.isArray(forwardReturns)
    ? forwardReturns
    : [];

  /* ---------------------------------------------------------
     🎨 Scorekleur
  --------------------------------------------------------- */
  const scoreColor = (score) => {
    const n = typeof score === "number" ? score : Number(score);
    if (isNaN(n)) return "text-gray-600";

    if (n >= 75) return "text-green-600";
    if (n <= 25) return "text-red-600";
    return "text-yellow-600";
  };

  /* ---------------------------------------------------------
     📈 Advies tekst
  --------------------------------------------------------- */
  const adviesText =
    safeMarketScore >= 75
      ? "Bullish"
      : safeMarketScore <= 25
      ? "Bearish"
      : "Neutraal";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* ------------------------------------------------------ */}
      {/* 📌 Titel */}
      {/* ------------------------------------------------------ */}
      <div className="flex items-center gap-3">
        <LineChart size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">
          Bitcoin Markt Analyse
        </h1>
      </div>

      {loading && (
        <p className="text-sm text-[var(--text-light)]">Data laden…</p>
      )}
      {error && (
        <p className="text-sm text-red-500">Fout: {error}</p>
      )}

      {/* ------------------------------------------------------ */}
      {/* 🤖 AI Agent Analyse */}
      {/* ------------------------------------------------------ */}
      <AgentInsightPanel category="market" />

      {/* ------------------------------------------------------ */}
      {/* 📊 Markt Score */}
      {/* ------------------------------------------------------ */}
      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Markt Score
            </h2>
          </div>

          <div className={`text-2xl font-bold ${scoreColor(safeMarketScore)}`}>
            {loading
              ? "…"
              : safeMarketScore !== null
              ? safeMarketScore.toFixed(1)
              : "–"}
          </div>

          <div className="flex items-center gap-2 text-lg">
            {adviesText === "Bullish" && (
              <TrendingUp className="text-green-600" size={20} />
            )}
            {adviesText === "Bearish" && (
              <TrendingDown className="text-red-600" size={20} />
            )}
            {adviesText === "Neutraal" && (
              <Info className="text-yellow-600" size={20} />
            )}

            <span className="font-semibold text-[var(--text-dark)]">
              Advies: {loading ? "…" : adviesText}
            </span>
          </div>
        </div>
      </CardWrapper>

      {/* ------------------------------------------------------ */}
      {/* 💹 Live BTC Data */}
      {/* ------------------------------------------------------ */}
      <MarketLiveCard
        price={safeLive.price ?? null}
        change24h={safeLive.change_24h ?? null}
        volume={safeLive.volume ?? null}
        timestamp={safeLive.timestamp ?? null}
      />

      {/* ------------------------------------------------------ */}
      {/* ⚙️ Indicator Score View */}
      {/* ------------------------------------------------------ */}
      <MarketIndicatorScoreView
        availableIndicators={availableIndicators || []}
        selectedIndicator={selectedIndicator || null}
        scoreRules={scoreRules || []}
        selectIndicator={selectIndicator}
        addMarketIndicator={addMarket}
      />

      {/* ------------------------------------------------------ */}
      {/* 📅 Dagelijkse Market Analyse */}
      {/* ------------------------------------------------------ */}
      <DayTable
        title="Dagelijkse Market Analyse"
        icon={<Activity className="w-5 h-5" />}
        data={safeMarketDayData}
        onRemove={removeMarket}
      />

      {/* ------------------------------------------------------ */}
      {/* 📆 7-Daagse Marktgeschiedenis */}
      {/* ------------------------------------------------------ */}
      <MarketSevenDayTable history={safeSevenDay} />

      {/* ------------------------------------------------------ */}
      {/* 🔮 Forward Returns Tabs */}
      {/* ------------------------------------------------------ */}
      <MarketForwardReturnTabs data={safeForward} />
    </div>
  );
}
