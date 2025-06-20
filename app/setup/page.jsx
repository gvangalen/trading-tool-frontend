'use client';

import { useState } from 'react';
import SetupForm from '@/components/setup/SetupForm';
import SetupList from '@/components/setup/SetupList';

export default function SetupPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* 🧱 Titel en uitleg */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">⚙️ Setup Editor</h2>
        <p className="text-gray-600 text-sm">
          Maak en beheer je eigen strategieën. De AI valideert dagelijks op basis van technische en macrodata.
        </p>
      </div>

      {/* 🧾 Setup aanmaken */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold">➕ Nieuwe Setup</h3>
        <SetupForm />
      </section>

      {/* 🔍 Zoek/filter */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-xl font-semibold">📋 Huidige Setups</h3>
        <input
          type="text"
          placeholder="🔎 Zoek op naam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-60 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* 🌀 Lijst (met loading en filter) */}
      <section className="space-y-4">
        <SetupList searchTerm={search} />
      </section>
    </div>
  );
}
