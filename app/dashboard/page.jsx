'use client';

import { useEffect, useState } from 'react';

// 📦 Components
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import TechnicalDayTableForDashboard from '@/components/technical/TechnicalDayTableForDashboard';
import MacroSummaryTableForDashboard from '@/components/macro/MacroSummaryTableForDashboard';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import DashboardHighlights from '@/components/dashboard/DashboardHighlights';
import RightSidebarCard from '@/components/cards/RightSidebarCard';
import CardWrapper from '@/components/ui/CardWrapper';
import MarketSummaryForDashboard from '@/components/market/MarketSummaryForDashboard';

// 🧠 Hooks
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
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 w-full">

        {/* 🔽 Linkerkolom */}
        <div className="space-y-10">

          <DashboardHighlights />

          <DashboardGauges />

          <CardWrapper>
            <h2 className="text-xl font-semibold mb-2">💰 Market Data</h2>
            <MarketSummaryForDashboard sevenDayData={sevenDayData} btcLive={btcLive} />
          </CardWrapper>

          <CardWrapper>
            <h2 className="text-xl font-semibold mb-2">📈 Technische Analyse</h2>
            {technicalLoading ? (
              <p className="text-gray-500">⏳ Laden...</p>
            ) : (
              <TechnicalDayTableForDashboard
                data={technicalData}
                loading={technicalLoading}
                onRemove={handleRemove}
              />
            )}
          </CardWrapper>

          <CardWrapper>
            <h2 className="text-xl font-semibold mb-2">🌍 Macro Indicatoren</h2>
            {macroLoading ? (
              <p className="text-gray-500">⏳ Laden...</p>
            ) : macroError ? (
              <p className="text-red-600">{macroError}</p>
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

          <CardWrapper>
            <h2 className="text-xl font-semibold mb-2">🚀 AI Tradingadvies</h2>
            <TradingAdvice />
          </CardWrapper>

          <CardWrapper>
            <h2 className="text-xl font-semibold mb-2">🏆 Top 3 Setups</h2>
            <TopSetupsMini />
          </CardWrapper>

        </div>

        {/* 🧠 Sticky rechterzijde */}
        <div className="hidden xl:block w-full max-w-xs">
          <div className="sticky top-20">
            <RightSidebarCard />
          </div>
        </div>

      </div>

      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          ⬆️
        </button>
      )}
    </div>
  );
}
