'use client';

import { useState, useEffect } from 'react';
import DashboardGauges from '@/components/DashboardGauges';
import TradingAdvice from '@/components/TradingAdvice';
import MarketTable from '@/components/MarketTable';
import MacroTable from '@/components/MacroTable';
import TechnicalTable from '@/components/TechnicalTable';
import SetupList from '@/components/SetupList';
import SetupInspector from '@/components/SetupInspector';

export default function DashboardPage() {
  const [showScroll, setShowScroll] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

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
        
        {/* 🔍 Extra knop voor inspector */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowInspector(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            🔍 Bekijk Setup Scores
          </button>
        </div>

        <SetupList />
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
      <SetupInspector visible={showInspector} onClose={() => setShowInspector(false)} />
    </div>
  );
}
