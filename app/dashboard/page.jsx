'use client';

import { useState, useEffect } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import MacroTable from '@/components/macro/MacroTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import SetupManager from '@/components/setup/SetupManager'; // ✅ Correcte nieuwe import


console.log('✅ DashboardGauges', DashboardGauges);
console.log('✅ TradingAdvice', TradingAdvice);
console.log('✅ MarketTable', MarketTable);
console.log('✅ MacroTable', MacroTable);
console.log('✅ TechnicalTable', TechnicalTable);
console.log('✅ SetupManager', SetupManager);


export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) setShowScroll(true);
      else setShowScroll(false);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">

      {/* ✅ Titel */}
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>

      {/* ✅ Meters */}
      <section>
        <DashboardGauges />
      </section>

      {/* ✅ Tradingadvies */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">🚀 Actueel Tradingadvies</h2>
        <TradingAdvice />
      </section>

      {/* ✅ Market Data */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">💰 Market Data</h2>
        <MarketTable />
      </section>

      {/* ✅ Macro Indicatoren */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">🌍 Macro Indicatoren</h2>
        <MacroTable />
      </section>

      {/* ✅ Technische Indicatoren */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">📈 Technische Analyse</h2>
        <TechnicalTable />
      </section>

      {/* ✅ Setups */}
      <section className="mt-10 mb-20">
        <h2 className="text-2xl font-bold mb-2">⚙️ Setup Overzicht</h2>

        {/* 🔍 Setup Manager */}
        <SetupManager />
      </section>

      {/* ✅ Scroll to top button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
          title="Terug naar boven"
        >
          ⬆️
        </button>
      )}

      {/* ✅ Popup Setup Inspector */}
      <SetupInspector /> {/* ⚡ Geen props meer nodig */}
    </div>
  );
}
