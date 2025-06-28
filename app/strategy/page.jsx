'use client';

import StrategyList from '@/components/strategy/StrategyList';
import StrategyForm from '@/components/strategy/StrategyForm';

export default function StrategyPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold">📈 Strategieën</h1>
        <p className="text-gray-600 mt-2">
          Bekijk je strategieën en voeg nieuwe toe.
        </p>
      </header>

      {/* 🔹 Strategieën (altijd zichtbaar, ook als leeg) */}
      <StrategyList />

      {/* 🔹 Formulier onderaan */}
      <section className="pt-10 border-t">
        <h2 className="text-xl font-semibold mb-4">➕ Nieuwe Strategie Toevoegen</h2>
        <StrategyForm />
      </section>
    </div>
  );
}
