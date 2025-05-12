'use client';
import StrategyList from '@/components/strategy/StrategyList';
import StrategyForm from '@/components/strategy/StrategyForm';
import StrategyGenerator from '@/components/strategy/StrategyGenerator';

export default function StrategyPage() {
  return (
    <div className="p-4 space-y-10">
      <h2 className="text-3xl font-bold">📈 Strategies Overview</h2>

      {/* AI-strategiegenerator */}
      <StrategyGenerator />

      {/* Strategieën lijst */}
      <StrategyList />

      {/* Toevoegformulier */}
      <div className="pt-10">
        <h3 className="text-2xl font-semibold mb-4">➕ Add New Strategy</h3>
        <StrategyForm />
      </div>
    </div>
  );
}
