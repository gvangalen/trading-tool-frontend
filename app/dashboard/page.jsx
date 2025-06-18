'use client';

import { useState, useEffect } from 'react';
import DashboardGauges from '@/components/dashboard/DashboardGauges';
import TradingAdvice from '@/components/dashboard/TradingAdvice';
import MarketTable from '@/components/market/MarketTable';
import MacroTable from '@/components/macro/MacroTable';
import TechnicalTable from '@/components/technical/TechnicalTable';
import SetupManager from '@/components/setup/SetupManager';
import AvatarMenu from '@/components/ui/AvatarMenu';

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
    <main className="px-4 md:px-6 max-w-screen-xl mx-auto scroll-smooth">
      {/* 🔝 Sticky Topbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-md mb-10 py-3 px-4 rounded-xl flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">📊 Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <NavButton label="🌡️ Scores" id="gauges" onClick={scrollToSection} />
            <NavButton label="🚀 Advies" id="advies" onClick={scrollToSection} />
            <NavButton label="💰 Market" id="market" onClick={scrollToSection} />
            <NavButton label="🌍 Macro" id="macro" onClick={scrollToSection} />
            <NavButton label="📈 Technisch" id="technical" onClick={scrollToSection} />
            <NavButton label="⚙️ Setups" id="setups" onClick={scrollToSection} />
          </div>
          <AvatarMenu />
        </div>
      </nav>

      {/* 📊 Gauges & Advies + Market naast elkaar */}
      <section id="gauges" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DashboardGauges />
          <section id="advies">
            <SectionHeader>🚀 Actueel Tradingadvies</SectionHeader>
            <TradingAdvice />
          </section>
        </div>
        <div>
          <section id="market">
            <SectionHeader>💰 Market Data</SectionHeader>
            <MarketTable />
          </section>
        </div>
      </section>

      {/* 🌍 Macro + 📈 Technical naast elkaar */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
        <section id="macro">
          <SectionHeader>🌍 Macro Indicatoren</SectionHeader>
          <MacroTable />
        </section>
        <section id="technical">
          <SectionHeader>📈 Technische Analyse</SectionHeader>
          <TechnicalTable />
        </section>
      </section>

      {/* ⚙️ Setups onderaan */}
      <section id="setups" className="mt-16 mb-24">
        <SectionHeader>⚙️ Setup Overzicht</SectionHeader>
        <SetupManager />
      </section>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition"
          title="Back to top"
        >
          ⬆️
        </button>
      )}
    </main>
  );
}

function NavButton({ label, id, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className="text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 dark:hover:bg-primary/20 transition font-medium"
    >
      {label}
    </button>
  );
}

function SectionHeader({ children }) {
  return <h2 className="text-2xl font-bold mb-4">{children}</h2>;
}
