"use client";

import { useMarketData } from "@/hooks/useMarketData";
import { useScoresData } from "@/hooks/useScoresData";

import MarketLiveCard from "@/components/market/MarketLiveCard";
import MarketSevenDayTable from "@/components/market/MarketSevenDayTable";
import MarketForwardReturnTabs from "@/components/market/MarketForwardReturnTabs";
import MarketIndicatorScoreView from "@/components/market/MarketIndicatorScoreView";
import MarketDayTable from "@/components/market/MarketDayTable";

import CardWrapper from "@/components/ui/CardWrapper";

// Nieuwe icons
import { LineChart, TrendingUp, TrendingDown, Gauge, Info } from "lucide-react";

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

  // 🎨 Score kleur
  const scoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score <= 25) return "text-red-600";
    return "text-yellow-600";
  };

  // 📊 Advies (zonder emoji)
  const adviesText =
    market?.score >= 75
      ? "Bullish"
      : market?.score <= 25
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
      {/* 📊 Markt Score */}
      {/* ------------------------------------------------------ */}
      <CardWrapper>
        <div className="space-y-4">
          {/* Titel */}
          <div className="flex items-center gap-2">
            <Gauge className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Markt Score
            </h2>
          </div>

          {/* Score */}
          <div className={`text-2xl font-bold ${scoreColor(market?.score)}`}>
            {loading ? "…" : market?.score?.toFixed(1) ?? "–"}
          </div>

          {/* Advies */}
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
        price={btcLive?.price}
        change24h={btcLive?.change_24h}
        volume={btcLive?.volume}
        timestamp={btcLive?.timestamp}
      />

      {/* ------------------------------------------------------ */}
      {/* ⚙️ Indicator Score View + Add Indicator */}
      {/* ------------------------------------------------------ */}
      <MarketIndicatorScoreView
        availableIndicators={availableIndicators}
        selectedIndicator={selectedIndicator}
        scoreRules={scoreRules}
        selectIndicator={selectIndicator}
        addMarketIndicator={addMarket}
      />

      {/* ------------------------------------------------------ */}
      {/* 🧮 Dagelijkse Market Analyse */}
      {/* ------------------------------------------------------ */}
      <CardWrapper title="Dagelijkse Market Analyse">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-soft)] text-[var(--text-dark)] border-b border-[var(--border)]">
              <th className="p-2">Indicator</th>
              <th className="p-2 text-center">Waarde</th>
              <th className="p-2 text-center">Score</th>
              <th className="p-2 text-center">Advies</th>
              <th className="p-2">Uitleg</th>
              <th className="p-2 text-center">Actie</th>
            </tr>
          </thead>

          <tbody>
            <MarketDayTable
              data={marketDayData}
              onRemove={removeMarket}
            />
          </tbody>
        </table>
      </CardWrapper>

      {/* ------------------------------------------------------ */}
      {/* 📆 7-Daagse Marktgeschiedenis */}
      {/* ------------------------------------------------------ */}
      <MarketSevenDayTable history={sevenDayData} />

      {/* ------------------------------------------------------ */}
      {/* 🔮 Forward Returns Tabs */}
      {/* ------------------------------------------------------ */}
      <MarketForwardReturnTabs data={forwardReturns} />
    </div>
  );
}
