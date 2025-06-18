'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/ui/NavBar'; // ✅ Nieuwe globale navigatie
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import MacroTable from '@/components/macro/MacroTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import SetupManager from '@/components/setup/SetupManager';

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ✅ Globale navigatie met avatar */}
      <NavBar onNavClick={scrollToSection} />

      {/* ✅ Main layout */}
      <main className="px-4 md:px-6 max-w-screen-xl mx-auto scroll-smooth mt-6">
        {/* 🌡️ Scores */}
        <section id="gauges" className="space-y-6">
          <DashboardGauges />
        </section>

        {/* 🚀 Advies */}
        <section id="advies" className="mt-16">
          <SectionHeader>🚀 Actueel Tradingadvies</SectionHeader>
          <TradingAdvice />
        </section>

        {/* 💰 Market */}
        <section id="market" className="mt-16">
          <SectionHeader>💰 Market Data</SectionHeader>
          <MarketTable />
        </section>

        {/* 🌍 Macro */}
        <section id="macro" className="mt-16">
          <SectionHeader>🌍 Macro Indicatoren</SectionHeader>
          <MacroTable />
        </section>

        {/* 📈 Technisch */}
        <section id="technical" className="mt-16">
          <SectionHeader>📈 Technische Analyse</SectionHeader>
          <TechnicalTable />
        </section>

        {/* ⚙️ Setups */}
        <section id="setups" className="mt-16 mb-24">
          <SectionHeader>⚙️ Setup Overzicht</SectionHeader>
          <SetupManager />
        </section>

        {/* ⬆️ Scroll to top */}
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
    </>
  );
}

// 🧩 Titelcomponent
function SectionHeader({ children }) {
  return <h2 className="text-2xl font-bold mb-4">{children}</h2>;
}
