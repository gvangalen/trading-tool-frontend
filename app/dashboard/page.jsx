'use client';

import { useEffect, useState } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import TechnicalTable from '@/components/technical/TechnicalDayTable'; // ✅ Nieuw
import MacroTable from '@/components/macro/MacroTable';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import DashboardHighlights from '@/components/dashboard/DashboardHighlights';
import RightSidebarCard from '@/components/cards/RightSidebarCard';
import CardWrapper from '@/components/ui/CardWrapper';

import MarketLiveCard from '@/components/market/MarketLiveCard';
import MarketSevenDayTable from '@/components/market/MarketSevenDayTable';
import MarketForwardReturnTabs from '@/components/market/MarketForwardReturnTabs';

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <main className="bg-gray-50 dark:bg-black min-h-screen py-8 px-4">
      <div className="relative max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* 🔽 Linker hoofdkolom */}
          <div className="space-y-10">

            {/* 🔷 Highlights */}
            <section>
              <DashboardHighlights />
            </section>

            {/* 📊 Meters */}
            <section>
              <DashboardGauges />
            </section>

            {/* 💰 Market Data */}
            <section className="space-y-6">
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">💰 Market Data</h2>
                <div className="space-y-4">
                  <MarketLiveCard />
                  <MarketSevenDayTable />
                  <MarketForwardReturnTabs />
                </div>
              </CardWrapper>
            </section>

            {/* 📈 Technische Analyse + 🌍 Macro */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">📈 Technische Analyse (Dag)</h2>
                <TechnicalTable /> {/* ✅ Dagelijkse tabel */}
              </CardWrapper>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🌍 Macro Indicatoren</h2>
                <MacroTable />
              </CardWrapper>
            </section>

            {/* 🚀 AI Advies */}
            <section>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🚀 AI Tradingadvies</h2>
                <TradingAdvice />
              </CardWrapper>
            </section>

            {/* 🏆 Top 3 Setups */}
            <section>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🏆 Top 3 Setups</h2>
                <TopSetupsMini />
              </CardWrapper>
            </section>
          </div>

          {/* 🧠 Sticky rechterzijde met rapport/tradingbot */}
          <div className="hidden xl:block w-full max-w-xs">
            <div className="sticky top-6 min-h-full">
              <RightSidebarCard />
            </div>
          </div>
        </div>
      </div>

      {/* 🔝 Scroll naar boven */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
          title="Terug naar boven"
        >
          ⬆️
        </button>
      )}
    </main>
  );
}
