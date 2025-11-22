"use client";

import { useEffect, useState } from 'react';

import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import TechnicalDayTableForDashboard from '@/components/technical/TechnicalDayTableForDashboard';
import MacroSummaryTableForDashboard from '@/components/macro/MacroSummaryTableForDashboard';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import DashboardHighlights from '@/components/dashboard/DashboardHighlights';
import RightSidebarCard from '@/components/cards/RightSidebarCard';
import CardWrapper from '@/components/ui/CardWrapper';
import MarketSummaryForDashboard from '@/components/market/MarketSummaryForDashboard';

import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useMacroData } from '@/hooks/useMacroData';
import { useMarketData } from '@/hooks/useMarketData';

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  const { technicalData, handleRemove, loading: technicalLoading } = useTechnicalData();
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

  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="p-6 pt-24 bg-[var(--bg)] text-[var(--text-dark)] min-h-screen">

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 w-full">

        <div className="space-y-10">

          <DashboardHighlights />

          <DashboardGauges />

          <CardWrapper title="💰 Market Data">
            <MarketSummaryForDashboard
              sevenDayData={sevenDayData}
              btcLive={btcLive}
            />
          </CardWrapper>

          <CardWrapper title="📈 Technische Analyse">
            {technicalLoading ? (
              <p className="text-[var(--text-light)]">⏳ Laden...</p>
            ) : (
              <TechnicalDayTableForDashboard
                data={technicalData}
                loading={technicalLoading}
                onRemove={handleRemove}
              />
            )}
          </CardWrapper>

          <CardWrapper title="🌍 Macro Indicatoren">
            {macroLoading ? (
              <p className="text-[var(--text-light)]">⏳ Laden...</p>
            ) : macroError ? (
              <p className="text-[var(--red)]">{macroError}</p>
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

          <CardWrapper title="🚀 AI Tradingadvies">
            <TradingAdvice />
          </CardWrapper>

          <CardWrapper title="🏆 Top 3 Setups">
            <TopSetupsMini />
          </CardWrapper>

        </div>

        <div className="hidden xl:block w-full max-w-xs">
          <div className="sticky top-24">
            <RightSidebarCard />
          </div>
        </div>

      </div>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6
            bg-[var(--primary)] text-white
            p-3 rounded-full shadow-md
            hover:bg-[var(--primary-dark)]
            transition
          "
        >
          ⬆️
        </button>
      )}
    </div>
  );
}
