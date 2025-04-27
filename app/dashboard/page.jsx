// ✅ app/dashboard/page.jsx
'use client';

import DashboardGauges from '@/components/DashboardGauges';
import TradingAdvice from '@/components/TradingAdvice';
import MarketTable from '@/components/MarketTable';
import MacroTable from '@/components/MacroTable';
import TechnicalTable from '@/components/TechnicalTable';
import SetupList from '@/components/SetupList';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">

      {/* ✅ Titel */}
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>

      {/* ✅ Meters */}
      <DashboardGauges />

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
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">⚙️ Setup Overzicht</h2>
        <SetupList />
      </section>

    </div>
  );
}
