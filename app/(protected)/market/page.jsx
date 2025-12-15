"use client";

import { useEffect } from "react";

import {
  LineChart,
  Gauge,
  Activity,
} from "lucide-react";

// Hooks
import { useMarketData } from "@/hooks/useMarketData";
import { useScoresData } from "@/hooks/useScoresData";
import { useModal } from "@/components/modal/ModalProvider";
import { useOnboarding } from "@/hooks/useOnboarding";

// Shared Components
import CardWrapper from "@/components/ui/CardWrapper";
import DayTable from "@/components/ui/DayTable";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

// Market Components
import MarketLiveCard from "@/components/market/MarketLiveCard";
import MarketSevenDayTable from "@/components/market/MarketSevenDayTable";
import MarketForwardReturnTabs from "@/components/market/MarketForwardReturnTabs";
import MarketIndicatorScoreView from "@/components/market/MarketIndicatorScoreView";

// Onboarding
import OnboardingBanner from "@/components/onboarding/OnboardingBanner";

export default function MarketPage() {
  // ===============================
  // 🧭 ONBOARDING
  // ===============================
  const { status, completeStep } = useOnboarding();

  // ===============================
  // 📊 MARKET DATA
  // ===============================
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

    activeMarketIndicatorNames,

    loading,
    error,
  } = useMarketData();

  const { market } = useScoresData();
  const { openConfirm, showSnackbar } = useModal();

  // ===============================
  // 🔥 ONBOARDING TRIGGER (DE FIX)
  // ===============================
  useEffect(() => {
    if (
      activeMarketIndicatorNames?.length > 0 &&
      status &&
      status.has_market === false
    ) {
      console.log("🧭 Onboarding: market step completed");
      completeStep("market");
    }
  }, [activeMarketIndicatorNames, status, completeStep]);

  /* ---------------------------------------------------------
     SAFE FALLBACKS
  --------------------------------------------------------- */
  const safeMarketScore =
    typeof market?.score === "number" ? market.score : null;

  const safeLive = btcLive || {};
  const safeMarketDayData = Array.isArray(marketDayData) ? marketDayData : [];
  const safeSevenDay = Array.isArray(sevenDayData) ? sevenDayData : [];
  const safeForward = forwardReturns || {};

  /* ---------------------------------------------------------
     SCORE KLEUR
  --------------------------------------------------------- */
  const scoreColor = (score) => {
    const n = Number(score);
    if (isNaN(n)) return "text-gray-600";
    if (n >= 75) return "text-green-600";
    if (n <= 25) return "text-red-600";
    return "text-yellow-600";
  };

  /* ---------------------------------------------------------
     ADVIES TEKST
  --------------------------------------------------------- */
  const adviesText =
    safeMarketScore >= 75
      ? "Bullish"
      : safeMarketScore <= 25
      ? "Bearish"
      : "Neutraal";

  /* ---------------------------------------------------------
     ❌ DELETE — IDENTIEK AAN MACRO
  --------------------------------------------------------- */
  const handleRemoveMarket = (name) => {
    if (!name) return;

    openConfirm({
      title: "Market-indicator verwijderen",
      description: `Weet je zeker dat je '${name}' wilt verwijderen?`,
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      tone: "danger",
      onConfirm: async () => {
        try {
          await removeMarket(name);
          showSnackbar(`'${name}' verwijderd`, "success");
        } catch (err) {
          console.error("❌ Market delete failed:", err);
          showSnackbar("Verwijderen mislukt", "danger");
        }
      },
    });
  };

  // ===============================
  // 🧱 RENDER
  // ===============================
  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12">

      {/* 🔥 Onboarding banner */}
      <OnboardingBanner step="market" />

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

      <AgentInsightPanel category="market" />

      {/* -----------------------------------------------------
         MARKET SCORE
      ----------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Markt Score
            </h2>
          </div>

          <div className={`text-2xl font-bold ${scoreColor(safeMarketScore)}`}>
            {safeMarketScore ?? "–"}
          </div>

          <div className="text-lg font-semibold text-[var(--text-dark)]">
            Advies: {adviesText}
          </div>
        </div>
      </CardWrapper>

      {/* -----------------------------------------------------
         LIVE MARKET
      ----------------------------------------------------- */}
      <MarketLiveCard
        price={safeLive.price ?? null}
        change24h={safeLive.change_24h ?? null}
        volume={safeLive.volume ?? null}
        timestamp={safeLive.timestamp ?? null}
      />

      {/* -----------------------------------------------------
         INDICATOR SCORELOGICA
      ----------------------------------------------------- */}
      <MarketIndicatorScoreView
        availableIndicators={availableIndicators || []}
        selectedIndicator={selectedIndicator || null}
        scoreRules={scoreRules || []}
        selectIndicator={selectIndicator}
        addMarketIndicator={addMarket}
        activeIndicators={activeMarketIndicatorNames || []}
      />

      {/* -----------------------------------------------------
         DAGTABEL
      ----------------------------------------------------- */}
      <DayTable
        title="Dagelijkse Market Analyse"
        icon={<Activity className="w-5 h-5" />}
        data={safeMarketDayData}
        onRemove={handleRemoveMarket}
      />

      <MarketSevenDayTable history={safeSevenDay} />
      <MarketForwardReturnTabs data={safeForward} />
    </div>
  );
}
