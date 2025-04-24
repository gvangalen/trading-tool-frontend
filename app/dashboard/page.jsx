// ✅ app/dashboard/page.jsx
'use client';

import NavBar from '@/components/NavBar';
import ScoreGauge from '@/components/ScoreGauge';
import MarketTable from '@/components/MarketTable';
import MacroTable from '@/components/MacroTable';
import TechnicalTable from '@/components/TechnicalTable';
import SetupManager from '@/components/SetupManager';
import TradingAdvice from '@/components/TradingAdvice';
import AssetSelector from '@/components/AssetSelector';

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-8">
      <NavBar />
      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      {/* 🔁 Live Scores */}
      <div className="flex flex-wrap gap-4">
        <ScoreGauge label="📉 Macro" id="macro" />
        <ScoreGauge label="📈 Technisch" id="technical" />
        <ScoreGauge label="📊 Setup" id="setup" />
      </div>

      {/* 🎯 Selecteer asset */}
      <AssetSelector />

      {/* 🧠 Tradingadvies */}
      <TradingAdvice />

      {/* 📈 Marktgegevens */}
      <h3 className="text-xl font-semibold mt-8">📊 Market Data</h3>
      <MarketTable />

      {/* 📉 Macro Indicatoren */}
      <h3 className="text-xl font-semibold mt-8">📉 Macro Indicatoren</h3>
      <MacroTable />

      {/* 📈 Technische Indicatoren */}
      <h3 className="text-xl font-semibold mt-8">📈 Technische Indicatoren</h3>
      <TechnicalTable />

      {/* 🧪 Setups beheren */}
      <h3 className="text-xl font-semibold mt-8">📋 Setups</h3>
      <SetupManager />
    </div>
  );
}
