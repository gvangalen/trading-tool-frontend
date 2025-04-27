'use client';

import { useEffect, useState } from 'react';

export default function SetupList() {
  const [setups, setSetups] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSetups();
  }, [filter, sortBy]);

  async function loadSetups() {
    try {
      const res = await fetch('/api/setups');
      const data = await res.json();
      let list = [...data];

      if (filter !== 'all') {
        list = list.filter((s) => s.trend === filter);
      }
      if (sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      const withExplanations = await Promise.all(
        list.map(async (s) => ({
          ...s,
          explanation: await getExplanation(s),
        }))
      );

      setSetups(withExplanations);
    } catch (error) {
      console.error('❌ Error loading setups:', error);
      setSetups([{ name: '⚠️ Error loading', indicators: '', trend: '', explanation: '...' }]);
    }
  }

  async function getExplanation(setup) {
    try {
      const res = await fetch('/api/ai/explain_setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      });
      const data = await res.json();
      return data.explanation || 'No explanation.';
    } catch (error) {
      console.error('❌ AI explanation error:', error);
      return 'AI explanation failed.';
    }
  }

  async function handleDelete(id) {
    if (!confirm('Weet je zeker dat je deze setup wilt verwijderen?')) return;
    await fetch(`/api/setups/${id}`, { method: 'DELETE' });
    loadSetups();
  }

  async function handleSave(id, updatedSetup) {
    await fetch(`/api/setups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSetup),
    });
    setEditingId(null);
    loadSetups();
  }

  async function toggleFavorite(id, currentFavorite) {
    await fetch(`/api/setups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite: !currentFavorite }),
    });
    loadSetups();
  }

  return (
    <div className="space-y-6 mt-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {setups.map((setup) => (
          <div key={setup.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition relative">

            <button
              onClick={() => toggleFavorite(setup.id, setup.favorite)}
              className="absolute top-3 right-3 text-2xl"
            >
              {setup.favorite ? '⭐️' : '☆'}
            </button>

            {editingId === setup.id ? (
              <>
                <input
                  className="border p-2 rounded w-full mb-2 font-semibold"
                  defaultValue={setup.name}
                  onChange={(e) => (setup.name = e.target.value)}
                />
                <input
                  className="border p-2 rounded w-full mb-2 text-sm"
                  defaultValue={setup.indicators}
                  onChange={(e) => (setup.indicators = e.target.value)}
                />
                <select
                  className="border p-2 rounded w-full mb-2"
                  defaultValue={setup.trend}
                  onChange={(e) => (setup.trend = e.target.value)}
                >
                  <option value="bullish">📈 Bullish</option>
                  <option value="bearish">📉 Bearish</option>
                  <option value="neutral">⚖️ Neutral</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSave(setup.id, setup)}
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
                <h3 className="font-bold text-lg mb-1">{setup.name}</h3>
                <p className="text-sm mb-2 text-gray-700">{setup.indicators}</p>
                <div className="text-xs text-gray-500 mb-2">💬 {setup.explanation}</div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingId(setup.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ✏️ Bewerken
                  </button>
                  <button
                    onClick={() => handleDelete(setup.id)}
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
