'use client';

import StrategyList from '@/components/strategy/StrategyList';
import StrategyGenerator from '@/components/strategy/StrategyGenerator';

export default function StrategyPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-12">
      {/* 🔹 Pagina Titel */}
      <header>
        <h1 className="text-3xl font-bold text-center">📈 Strategieën</h1>
        <p className="text-gray-600 text-center mt-2">
          Beheer je strategieën, genereer AI-voorstellen of voeg handmatig nieuwe strategieën toe.
        </p>
      </header>

      {/* 🔹 AI-strategiegenerator */}
      <section>
        <StrategyGenerator />
      </section>

      {/* 🔹 Strategieënlijst incl. formulier en kaarten */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📋 Jouw Strategieën</h2>
        <StrategyList />
      </section>
    </div>
  );
}
