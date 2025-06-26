'use client';

import StrategyList from '@/components/strategy/StrategyList';
import StrategyForm from '@/components/strategy/StrategyForm';
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

      {/* 🔹 Strategieënlijst */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📋 Jouw Strategieën</h2>
        <StrategyList />
      </section>

      {/* 🔹 Nieuw Strategieformulier (inklapbaar) */}
      <section className="pt-10 border-t">
        <details open className="w-full">
          <summary className="cursor-pointer text-xl font-medium py-2 text-blue-700 hover:underline">
            ➕ Nieuwe Strategie Toevoegen
          </summary>
          <div className="mt-4">
            <StrategyForm />
          </div>
        </details>
      </section>
    </div>
  );
}
