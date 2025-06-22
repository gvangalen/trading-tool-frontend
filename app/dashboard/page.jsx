'use client';

import { useEffect, useState } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import MacroTable from '@/components/macro/MacroTable';
import SetupManager from '@/components/setup/SetupManager';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import DashboardHighlights from '@/components/dashboard/DashboardHighlights';
import RightSidebarCard from '@/components/dashboard/RightSidebarCard';
import CardWrapper from '@/components/ui/CardWrapper';

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

            {/* 💰 Market Data + 📈 Technische Analyse */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">💰 Market Data</h2>
                <MarketTable />
              </CardWrapper>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">📈 Technische Analyse</h2>
                <TechnicalTable />
              </CardWrapper>
            </section>

            {/* 🌍 Macro + 🚀 AI Advies */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🌍 Macro Indicatoren</h2>
                <MacroTable />
              </CardWrapper>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🚀 AI Tradingadvies</h2>
                <TradingAdvice />
              </CardWrapper>
            </section>

            {/* 🏆 Top 3 Setups + ⚙️ Setupbeheer */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">🏆 Top 3 Setups</h2>
                <TopSetupsMini />
              </CardWrapper>
              <CardWrapper>
                <h2 className="text-xl font-semibold mb-2">⚙️ Setupbeheer</h2>
                <SetupManager />
              </CardWrapper>
            </section>
          </div>

          {/* 🧠 Sticky rechterzijde met rapport/tradingbot */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
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
