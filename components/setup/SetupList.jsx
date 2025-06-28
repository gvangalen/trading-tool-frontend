'use client';

import { useState } from 'react';
import { useSetupData } from '@/hooks/useSetupData';
import { generateExplanation } from '@/lib/setupService';

export default function SetupList({ searchTerm = '' }) {
  const {
    setups,
    loading,
    error,
    saveSetup,
    removeSetup,
    loadSetups,
  } = useSetupData();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const filteredSortedSetups = () => {
    let list = [...setups];
    if (filter !== 'all') {
      list = list.filter((s) => s.trend === filter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((s) => (s.name || '').toLowerCase().includes(q));
    }
    if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  };

  async function handleSave(id) {
    if (!editingValues[id]) return;
    await saveSetup(id, editingValues[id]);
    setEditingId(null);
    setEditingValues({});
  }

  async function handleGenerateExplanation(id) {
    try {
      await generateExplanation(id);
      await loadSetups();
    } catch (err) {
      console.error('❌ Fout bij AI-explanation:', err);
    }
  }

  function handleEditChange(id, field, value) {
    setEditingValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  // 🔹 Demo setup bovenaan
  const demoSetup = {
    id: 'demo',
    name: 'Voorbeeld Setup',
    indicators: 'RSI, 200MA, Volume',
    trend: 'bullish',
    timeframe: '1D',
    symbol: 'BTCUSDT',
    strategy_type: 'Breakout',
    account_type: 'Spot',
    explanation: 'Dit is een voorbeeld van hoe een setup eruitziet.',
    favorite: false,
  };

  return (
    <div className="space-y-6 mt-6">
      {/* 🔹 Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded bg-white">
          <option value="all">🔁 Alle trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded bg-white">
          <option value="name">🔤 Sorteer op naam</option>
        </select>
      </div>

      {loading && <div className="text-gray-500 text-sm">📡 Laden setups...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* 🔹 Setup kaarten */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 🔸 Voorbeeldkaart */}
        <div className="border rounded-lg p-4 bg-gray-100 shadow opacity-60 pointer-events-none select-none">
          <h3 className="font-bold text-lg mb-1">{demoSetup.name}</h3>
          <p className="text-sm mb-1 text-gray-700">{demoSetup.indicators}</p>
          <p className="text-xs mb-1 text-green-600">📊 {demoSetup.trend}</p>
          <p className="text-xs text-gray-500 mb-1">⏱️ {demoSetup.timeframe} | 💼 {demoSetup.account_type} | 🧠 {demoSetup.strategy_type}</p>
          <p className="text-xs text-gray-500 mb-2">🔖 {demoSetup.symbol}</p>
          <div className="text-xs text-gray-600 bg-white p-2 rounded border">
            💬 {demoSetup.explanation}
          </div>
        </div>

        {/* 🔸 Echte setups */}
        {filteredSortedSetups().map((setup) => {
          const isEditing = editingId === setup.id;
          const trendColor =
            setup.trend === 'bullish' ? 'text-green-600' :
            setup.trend === 'bearish' ? 'text-red-500' :
            'text-yellow-500';

          return (
            <div key={setup.id} className="border rounded-lg p-4 bg-white shadow relative transition">
              {/* ⭐ Favoriet placeholder */}
              <button className="absolute top-3 right-3 text-2xl" disabled title="Favoriet toggle (nog niet actief)">
                {setup.favorite ? '⭐️' : '☆'}
              </button>

              {isEditing ? (
                <>
                  <input
                    className="border p-2 rounded w-full mb-2 font-semibold"
                    defaultValue={setup.name}
                    onChange={(e) => handleEditChange(setup.id, 'name', e.target.value)}
                  />
                  <input
                    className="border p-2 rounded w-full mb-2"
                    defaultValue={setup.indicators}
                    onChange={(e) => handleEditChange(setup.id, 'indicators', e.target.value)}
                  />
                  <select
                    className="border p-2 rounded w-full mb-2"
                    defaultValue={setup.trend}
                    onChange={(e) => handleEditChange(setup.id, 'trend', e.target.value)}
                  >
                    <option value="bullish">📈 Bullish</option>
                    <option value="bearish">📉 Bearish</option>
                    <option value="neutral">⚖️ Neutraal</option>
                  </select>
                  <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Timeframe"
                    defaultValue={setup.timeframe}
                    onChange={(e) => handleEditChange(setup.id, 'timeframe', e.target.value)}
                  />
                  <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Symbol"
                    defaultValue={setup.symbol}
                    onChange={(e) => handleEditChange(setup.id, 'symbol', e.target.value)}
                  />
                  <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Strategy type"
                    defaultValue={setup.strategy_type}
                    onChange={(e) => handleEditChange(setup.id, 'strategy_type', e.target.value)}
                  />
                  <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Account type"
                    defaultValue={setup.account_type}
                    onChange={(e) => handleEditChange(setup.id, 'account_type', e.target.value)}
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleSave(setup.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                      ✅ Opslaan
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm">
                      ❌ Annuleren
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-1">{setup.name}</h3>
                  <p className="text-sm mb-1 text-gray-700">{setup.indicators}</p>
                  <p className={`text-xs mb-1 ${trendColor}`}>📊 {setup.trend}</p>
                  <p className="text-xs text-gray-500 mb-1">⏱️ {setup.timeframe} | 💼 {setup.account_type} | 🧠 {setup.strategy_type}</p>
                  <p className="text-xs text-gray-500 mb-2">🔖 {setup.symbol}</p>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mb-2">
                    💬 {setup.explanation || 'Geen uitleg beschikbaar.'}
                  </div>
                  <button
                    onClick={() => handleGenerateExplanation(setup.id)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded mb-2"
                  >
                    🔁 Genereer uitleg (AI)
                  </button>
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingId(setup.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      ✏️ Bewerken
                    </button>
                    <button onClick={() => removeSetup(setup.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                      ❌ Verwijderen
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {!filteredSortedSetups().length && (
        <p className="text-sm text-gray-500 mt-4">
          ❌ Geen setups gevonden voor deze filters of zoekterm.
        </p>
      )}
    </div>
  );
}
