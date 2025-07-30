'use client';

import { useState } from 'react';
import StrategyList from '@/components/strategy/StrategyList';
import StrategyForm from '@/components/strategy/StrategyFormTrading';

export default function StrategyPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* 🧠 Titel en uitleg */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📈 Strategieën</h1>
        <p className="text-gray-600 text-sm">
          Bekijk en beheer je strategieën. De AI helpt bij uitleg, entry en risk management.
        </p>
      </header>

      {/* 🔍 Zoek/filter boven de lijst */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-xl font-semibold">📋 Huidige Strategieën</h3>
        <input
          type="text"
          placeholder="🔎 Zoek op asset of tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-60 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* 📋 Strategieënlijst */}
      <section>
        <StrategyList searchTerm={search} />
      </section>

      {/* ➕ Formulier onderaan */}
      <section className="pt-10 border-t">
        <h2 className="text-xl font-semibold mb-4">➕ Nieuwe Strategie Toevoegen</h2>
        <StrategyForm />
      </section>
    </div>
  );
}
