'use client';

import { useState, useEffect } from 'react';
import StrategyList from '@/components/strategy/StrategyList';
import StrategyTabs from '@/components/strategy/StrategyTabs';
import { fetchSetups, fetchDcaSetups } from '@/lib/api/setups';
import { createStrategy } from '@/lib/api/strategy';

export default function StrategyPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [setups, setSetups] = useState([]);
  const [dcaSetups, setDcaSetups] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [allSetups, dca] = await Promise.all([fetchSetups(), fetchDcaSetups()]);
        setSetups(allSetups || []);
        setDcaSetups(dca || []);
      } catch (err) {
        console.error('❌ Fout bij laden van setups:', err);
      }
    }
    loadData();
  }, []);

  const handleSuccess = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  const handleStrategySubmit = async (strategy) => {
    try {
      const setup = setups.find((s) => String(s.id) === String(strategy.setup_id));
      if (!setup) {
        setToast('❌ Geen geldige setup geselecteerd.');
        return;
      }

      const payload = {
        ...strategy,
        setup_id: setup.id,
        setup_name: setup.name,
        asset: setup.symbol,
        timeframe: setup.timeframe,
        explanation: strategy.explanation || strategy.rules || '',
        entry: strategy.entry || null,
        targets: strategy.targets || [],
        stop_loss: strategy.stop_loss || null,
        favorite: false,
        tags: [],
      };

      console.log('📤 Strategie opslaan:', payload);
      await createStrategy(payload);
      handleSuccess('✅ Strategie succesvol opgeslagen!');
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      setToast('❌ Strategie opslaan mislukt.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* 🧠 Titel en uitleg */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📈 Strategieën</h1>
        <p className="text-gray-600 text-sm">
          Bekijk en beheer je strategieën. Kies een methode: AI, DCA of handmatig.
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

      {/* 🔔 Succesmelding */}
      {toast && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-sm">
          {toast}
        </div>
      )}

      {/* ➕ Strategie toevoegen */}
      <section className="pt-10 border-t">
        <h2 className="text-xl font-semibold mb-4">➕ Nieuwe Strategie Toevoegen</h2>
        <StrategyTabs onSubmit={handleStrategySubmit} setups={setups} dcaSetups={dcaSetups} />
      </section>
    </div>
  );
}