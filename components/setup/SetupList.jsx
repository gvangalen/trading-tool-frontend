'use client';

import { useState } from 'react';
import { useSetupData } from '@/hooks/useSetupData'; // 🔥 nieuw systeem

export default function SetupList() {
  const {
    setups,
    loading,
    error,
    updateSetup,
    deleteSetup,
    toggleFavorite,
    generateExplanation,
  } = useSetupData();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  function filteredSortedSetups() {
    let list = [...setups];

    if (filter !== 'all') {
      list = list.filter((s) => s.trend === filter);
    }
    if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }

  async function handleSave(id) {
    if (!editingValues[id]) return;
    await updateSetup(id, editingValues[id]);
    setEditingId(null);
    setEditingValues({});
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

  return (
    <div className="space-y-6 mt-6">
      {/* 🔹 Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded bg-white shadow-sm"
        >
          <option value="all">🔁 Alle trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded bg-white shadow-sm"
        >
          <option value="name">🔤 Sorteer op naam</option>
        </select>
      </div>

      {/* 🔹 Loading/Error */}
      {loading && <div className="text-gray-500 text-sm">📡 Laden setups...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* 🔹 Setup cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSortedSetups().map((setup) => (
          <div key={setup.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition relative">
            
            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(setup.id, setup.favorite)}
              className="absolute top-3 right-3 text-2xl"
              title="Favoriet aan/uit"
            >
              {setup.favorite ? '⭐️' : '☆'}
            </button>

            {editingId === setup.id ? (
              <>
                {/* Editing mode */}
                <input
                  className="border p-2 rounded w-full mb-2 font-semibold"
                  defaultValue={setup.name}
                  onChange={(e) => handleEditChange(setup.id, 'name', e.target.value)}
                />
                <input
                  className="border p-2 rounded w-full mb-2 text-sm"
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
                  <option value="neutral">⚖️ Neutral</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSave(setup.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ✅ Opslaan
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    ❌ Annuleren
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View mode */}
                <h3 className="font-bold text-lg mb-1">{setup.name}</h3>
                <p className="text-sm mb-2 text-gray-700">{setup.indicators}</p>
                <div className="text-xs text-gray-500 mb-2">💬 {setup.explanation || 'Geen uitleg.'}</div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingId(setup.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ✏️ Bewerken
                  </button>
                  <button
                    onClick={() => deleteSetup(setup.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ❌ Verwijderen
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
