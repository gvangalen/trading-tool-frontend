'use client';

import { useEffect, useState } from 'react';
import AvatarMenu from '@/components/ui/AvatarMenu';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import MacroTable from '@/components/macro/MacroTable';
import SetupManager from '@/components/setup/SetupManager';
import TopSetupsMini from '@/components/setup/TopSetupsMini'; // ✅ optioneel als je top 3 wilt tonen

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
      {/* ✅ Container */}
      <div className="bg-white dark:bg-gray-900 max-w-screen-xl mx-auto rounded-xl shadow-lg p-6 md:p-10 space-y-10">

        {/* 🔝 Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">📊 Dashboard</h1>
          <AvatarMenu />
        </div>

        {/* 📊 Gauges */}
        <section>
          <DashboardGauges />
        </section>

        {/* 🧭 Market & Technical */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">💰 Market Data</h2>
            <MarketTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">📈 Technische Analyse</h2>
            <TechnicalTable />
          </div>
        </section>

        {/* 🌍 Macro & Tradingadvies */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">🌍 Macro Indicatoren</h2>
            <MacroTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">🚀 AI Tradingadvies</h2>
            <TradingAdvice />
          </div>
        </section>

        {/* 🏆 Top Setups + Setup Manager */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">🏆 Top 3 Setups</h2>
            <TopSetupsMini />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">⚙️ Setup Overzicht</h2>
            <SetupManager />
          </div>
        </section>
      </div>

      {/* 🔝 Scroll-to-top knop */}
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
