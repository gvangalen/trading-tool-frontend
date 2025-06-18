'use client';

import { useEffect, useRef, useState } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import MacroTable from '@/components/macro/MacroTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import SetupManager from '@/components/setup/SetupManager';
import AvatarMenu from '@/components/ui/AvatarMenu';

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
      {/* ✅ White Card Container */}
      <div className="bg-white dark:bg-gray-900 max-w-screen-xl mx-auto rounded-xl shadow-lg p-6 md:p-10 space-y-10">
        {/* 🔝 Navigatie en Avatar */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">📊 Dashboard</h1>
          <AvatarMenu />
        </div>

        {/* 📊 Scores (Meters) */}
        <section>
          <DashboardGauges />
        </section>

        {/* 🧭 Markt en Technisch naast elkaar */}
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

        {/* 🌍 Macro en AI advies */}
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

        {/* ⚙️ Setups */}
        <section>
          <h2 className="text-xl font-semibold mb-2">⚙️ Setup Overzicht</h2>
          <SetupManager />
        </section>
      </div>

      {/* 🔝 Scroll to top */}
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
