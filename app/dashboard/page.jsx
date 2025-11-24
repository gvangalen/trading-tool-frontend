"use client";

import { useEffect, useState } from "react";

// Lucide icons
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

  // Scroll button
  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[var(--bg)]
        px-6 md:px-10
        pt-24 pb-16
        text-[var(--text-dark)]
      "
    >
      {/* ================= HEADER ================ */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[var(--text-dark)]" />
          Trading Dashboard
        </h1>
      </header>

      {/* ================= HIGHLIGHTS (full-width) ================ */}
      <div className="mb-10">
        <DashboardHighlights />
      </div>

      {/* ================= MAIN CONTENT ================ */}
      <div className="flex flex-col xl:flex-row gap-10">
        {/* MAIN COLUMN */}
        <div className="flex-1 space-y-10">
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
                <TrendingUp className="w-4 h-4" /> Technische Analyse
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

          {/* MACRO */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Macro Indicatoren
              </div>
            }
          >
            {macroLoading ? (
              <p className="text-[var(--text-light)] text-sm">
                ⏳ Macrodata laden...
              </p>
            ) : macroError ? (
              <p className="text-[var(--red)] text-sm">{macroError}</p>
            ) : (
              <MacroSummaryTableForDashboard
                data={macroData}
                calculateScore={calculateMacroScore}
                getExplanation={getExplanation}
                onEdit={handleEdit}
                onRemove={handleMacroRemove}
              />
            )}
          </CardWrapper>

          {/* TRADING ADVIES */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4" /> AI Tradingadvies
              </div>
            }
          >
            <TradingAdvice />
          </CardWrapper>

          {/* TOP SETUPS */}
          <CardWrapper
            title={
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Top 3 Setups
              </div>
            }
          >
            <TopSetupsMini />
          </CardWrapper>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-[320px]">
          <div className="sticky top-28">
            <RightSidebarCard />
          </div>
        </aside>
      </div>

      {/* ================= SCROLL BUTTON ================ */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6
            bg-[var(--primary)] text-white
            p-3 rounded-full shadow-lg
            hover:bg-[var(--primary-dark)]
            transition
            focus:ring-2 focus:ring-[var(--primary)]
          "
        >
          <ChevronsUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
