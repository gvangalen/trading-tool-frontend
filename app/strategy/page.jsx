'use client';
import StrategyList from '@/components/StrategyList';
import StrategyForm from '@/components/StrategyForm';
import StrategyGenerator from '@/components/StrategyGenerator';

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
