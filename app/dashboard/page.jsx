'use client';

import { useState, useEffect } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import MacroTable from '@/components/macro/MacroTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import SetupManager from '@/components/setup/SetupManager';

// ✅ Alleen loggen in development
if (process.env.NODE_ENV === 'development') {
  console.log('✅ Componenten geladen');
}

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto scroll-smooth">
      {/* 🔝 Sticky Navigatie */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md mb-8 py-3 px-4 rounded flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold">📊 Dashboard</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <button onClick={() => scrollToSection('gauges')} className="hover:underline">🌡️ Scores</button>
          <button onClick={() => scrollToSection('advies')} className="hover:underline">🚀 Advies</button>
          <button onClick={() => scrollToSection('market')} className="hover:underline">💰 Market</button>
          <button onClick={() => scrollToSection('macro')} className="hover:underline">🌍 Macro</button>
          <button onClick={() => scrollToSection('technical')} className="hover:underline">📈 Technisch</button>
          <button onClick={() => scrollToSection('setups')} className="hover:underline">⚙️ Setups</button>
        </div>
      </nav>

      {/* 📊 Meters */}
      <section id="gauges" className="space-y-6">
        <DashboardGauges />
      </section>

      {/* 🚀 Advies */}
      <section id="advies" className="mt-12">
        <h2 className="text-2xl font-bold mb-2">🚀 Actueel Tradingadvies</h2>
        <TradingAdvice />
      </section>

      {/* 💰 Market */}
      <section id="market" className="mt-12">
        <h2 className="text-2xl font-bold mb-2">💰 Market Data</h2>
        <MarketTable />
      </section>

      {/* 🌍 Macro */}
      <section id="macro" className="mt-12">
        <h2 className="text-2xl font-bold mb-2">🌍 Macro Indicatoren</h2>
        <MacroTable />
      </section>

      {/* 📈 Technisch */}
      <section id="technical" className="mt-12">
        <h2 className="text-2xl font-bold mb-2">📈 Technische Analyse</h2>
        <TechnicalTable />
      </section>

      {/* ⚙️ Setups */}
      <section id="setups" className="mt-12 mb-24">
        <h2 className="text-2xl font-bold mb-2">⚙️ Setup Overzicht</h2>
        <SetupManager />
      </section>

      {/* 🔝 Scroll to Top */}
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
