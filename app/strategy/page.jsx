'use client';

import StrategyList from '@/components/strategy/StrategyList';
import StrategyForm from '@/components/strategy/StrategyForm';
import StrategyGenerator from '@/components/strategy/StrategyGenerator';

export default function StrategyPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-12">
      {/* 🔹 Titel */}
      <header>
        <h1 className="text-3xl font-bold text-center">📈 Strategieën Overzicht</h1>
        <p className="text-gray-600 text-center mt-2">
          Bekijk, genereer of voeg strategieën toe voor je setups.
        </p>
      </header>

      {/* 🔹 AI-strategiegenerator */}
      <section>
        <StrategyGenerator />
      </section>

      {/* 🔹 Strategieënlijst */}
      <section>
        <StrategyList />
      </section>

      {/* 🔹 Toevoegformulier */}
      <section className="pt-10 border-t">
        <h2 className="text-2xl font-semibold mb-4">➕ Nieuwe Strategie Toevoegen</h2>
        <StrategyForm />
      </section>
    </div>
  );
}
