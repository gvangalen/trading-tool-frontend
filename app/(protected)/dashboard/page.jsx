"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  Coins,
  Rocket,
  Trophy,
  ChevronsUp,
} from "lucide-react";

import DashboardGauges from "@/components/dashboard/DashboardGauges";
import TradingAdvice from "@/components/dashboard/TradingAdvice";
import TechnicalDayTableForDashboard from "@/components/technical/TechnicalDayTableForDashboard";
import MacroSummaryTableForDashboard from "@/components/macro/MacroSummaryTableForDashboard";
import TopSetupsMini from "@/components/setup/TopSetupsMini";
import DashboardHighlights from "@/components/dashboard/DashboardHighlights";
import RightSidebarCard from "@/components/cards/RightSidebarCard";
import CardWrapper from "@/components/ui/CardWrapper";
import MarketSummaryForDashboard from "@/components/market/MarketSummaryForDashboard";

import { useTechnicalData } from "@/hooks/useTechnicalData";
import { useMacroData } from "@/hooks/useMacroData";
import { useMarketData } from "@/hooks/useMarketData";

// 🔥 PageLoader overlay
import PageLoader from "@/components/ui/PageLoader";

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  // --------------------------------------------------------
  // 📡 DATA HOOKS
  // --------------------------------------------------------
  const {
    technicalData,
    handleRemove,
    loading: technicalLoading,
    error: technicalError,
  } = useTechnicalData();

  const {
    macroData,
    loading: macroLoading,
    error: macroError,
  } = useMacroData();

  const { sevenDayData, btcLive } = useMarketData();

  // --------------------------------------------------------
  // 🔥 PAGE LOADING OVERLAY
  // --------------------------------------------------------
  const pageLoading =
    technicalLoading ||
    macroLoading ||
    sevenDayData == null ||
    btcLive == null;

  // Scroll-to-top button
  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative max-w-screen-xl mx-auto pt-6 px-6 pb-14 space-y-12 animate-fade-slide">
      {/* 🔵 Loader overlay boven de hele pagina */}
      {pageLoading && <PageLoader text="Dashboard wordt geladen…" />}

      {/* PAGE TITLE */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-7 h-7 text-[var(--primary)]" />
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-dark)]">
          Trading Dashboard
        </h1>
      </div>

      {/* HIGHLIGHTS */}
      <DashboardHighlights />

      {/* MAIN CONTENT ROW */}
      <div className="flex flex-col xl:flex-row gap-12">
        {/* MAIN COLUMN */}
        <main className="flex-1 space-y-12">
          {/* GAUGES */}
          <DashboardGauges />

          {/* MARKET (CARD) */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 icon-primary" />
                Market Data
              </div>
            }
          >
            <MarketSummaryForDashboard
              sevenDayData={sevenDayData}
              btcLive={btcLive}
            />
          </CardWrapper>

          {/* TECHNICAL */}
          <TechnicalDayTableForDashboard
            data={technicalData}
            loading={technicalLoading}
            error={technicalError}
            onRemove={handleRemove}
          />

          {/* MACRO */}
          <MacroSummaryTableForDashboard
            data={macroData}
            loading={macroLoading}
            error={macroError}
          />

          {/* TRADING ADVICE */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 icon-primary" />
                AI Tradingadvies
              </div>
            }
          >
            <TradingAdvice />
          </CardWrapper>

          {/* TOP SETUPS */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 icon-primary" />
                Top 3 Setups
              </div>
            }
          >
            <TopSetupsMini />
          </CardWrapper>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-[320px] shrink-0">
          <div className="sticky top-28">
            <RightSidebarCard />
          </div>
        </aside>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6
            bg-[var(--primary)] text-white
            p-3 rounded-full shadow-lg
            hover:bg-[var(--primary-strong)]
            transition-all
            focus:ring-2 focus:ring-[var(--primary)]
          "
        >
          <ChevronsUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
