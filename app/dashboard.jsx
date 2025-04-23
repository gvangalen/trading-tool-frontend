import NavBar from '@/components/NavBar';
import ScoreGauge from '@/components/ScoreGauge';
import MarketTable from '@/components/MarketTable';
import MacroTable from '@/components/MacroTable';
import TechnicalTable from '@/components/TechnicalTable';
import SetupTable from '@/components/SetupTable';
import SetupInspector from '@/components/SetupInspector';
import AssetSelector from '@/components/AssetSelector';
import TradingAdvice from '@/components/TradingAdvice';

export default function Dashboard() {
  return (
    <div className="p-4 space-y-8">
      <NavBar />
      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      <div className="flex flex-wrap gap-4">
        <ScoreGauge label="📉 Macro" id="macro" />
        <ScoreGauge label="📈 Technisch" id="technical" />
        <ScoreGauge label="📊 Setup" id="setup" />
      </div>

      <AssetSelector />
      <TradingAdvice />

      <h3 className="text-xl font-semibold mt-8">📊 Market Data</h3>
      <MarketTable />

      <h3 className="text-xl font-semibold mt-8">📊 Macro Indicatoren</h3>
      <MacroTable />

      <h3 className="text-xl font-semibold mt-8">📊 Technische Indicatoren</h3>
      <TechnicalTable />

      <h3 className="text-xl font-semibold mt-8">📊 Setups</h3>
      <SetupTable />
      <SetupInspector />
    </div>
  );
}
