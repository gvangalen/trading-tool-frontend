"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  Coins,
  TrendingUp,
  Globe2,
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

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  const { technicalData, handleRemove, loading: technicalLoading } =
    useTechnicalData();

  const {
    macroData,
    loading: macroLoading,
    error: macroError,
    handleEdit,
    handleRemove: handleMacroRemove,
    calculateMacroScore,
    getExplanation,
  } = useMacroData();

  const { sevenDayData, btcLive } = useMarketData();

  // Scroll-button logic
  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="max-w-screen-xl mx-auto pt-6 px-6 pb-14 space-y-12 animate-fade-slide">

      {/* ---------------------------------------------------- */}
      {/* PAGE TITLE */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-7 h-7 text-[var(--primary)]" />
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-dark)]">
          Trading Dashboard
        </h1>
      </div>

      {/* ---------------------------------------------------- */}
      {/* HIGHLIGHTS (Top stats blocks) */}
      {/* ---------------------------------------------------- */}
      <DashboardHighlights />

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT ROW */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col xl:flex-row gap-12">

        {/* ================= MAIN COLUMN ================= */}
        <main className="flex-1 space-y-12">

          {/* GAUGES */}
          <DashboardGauges />

          {/* MARKET */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
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
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Technische Analyse
              </div>
            }
          >
            {technicalLoading ? (
              <p className="text-[var(--text-light)] text-sm">
                ⏳ Technische data laden...
              </p>
            ) : (
              <TechnicalDayTableForDashboard
                data={technicalData}
                loading={technicalLoading}
                onRemove={handleRemove}
              />
            )}
          </CardWrapper>

          {/* ---------------------------------------------------- */}
          {/* MACRO (GEEN CARDWRAPPER MEER!) */}
          {/* ---------------------------------------------------- */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-[var(--text-dark)]">
                Macro Indicatoren
              </h2>
            </div>

            {macroLoading ? (
              <p className="text-[var(--text-light)] text-sm">
                ⏳ Macrodata laden...
              </p>
            ) : macroError ? (
              <p className="text-red-500 text-sm">{macroError}</p>
            ) : (
              <MacroSummaryTableForDashboard
                data={macroData}
                calculateScore={calculateMacroScore}
                getExplanation={getExplanation}
                onEdit={handleEdit}
                onRemove={handleMacroRemove}
              />
            )}
          </section>

          {/* TRADING ADVIES */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
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
                <Trophy className="w-4 h-4" />
                Top 3 Setups
              </div>
            }
          >
            <TopSetupsMini />
          </CardWrapper>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="w-full xl:w-[320px] shrink-0">
          <div className="sticky top-28">
            <RightSidebarCard />
          </div>
        </aside>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SCROLL TO TOP BUTTON */}
      {/* ---------------------------------------------------- */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6
            bg-[var(--primary)] text-white
            p-3 rounded-full shadow-lg
            hover:bg-[var(--primary-dark)]
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
