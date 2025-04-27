'use client';

import { useEffect, useState } from 'react';

export default function SetupList() {
  const [setups, setSetups] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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
    if (!confirm('Are you sure you want to delete this setup?')) return;
    await fetch(`/api/setups/${id}`, { method: 'DELETE' });
    loadSetups();
  }

  async function handleSave(id, name, indicators, trend) {
    if (!name || !indicators || !trend) {
      alert('⚠️ Fill in all fields correctly.');
      return;
    }
    await fetch(`/api/setups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, indicators, trend }),
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
          <option value="all">🔁 All Trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutral</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded bg-white shadow-sm"
        >
          <option value="name">🔤 Sort by Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {setups.map((setup) => (
          <div key={setup.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
            <div className="space-y-2">
              <input
                className="border p-2 rounded w-full font-semibold"
                defaultValue={setup.name}
                onChange={(e) => (setup.name = e.target.value)}
              />
              <input
                className="border p-2 rounded w-full text-sm"
                defaultValue={setup.indicators}
                onChange={(e) => (setup.indicators = e.target.value)}
              />
              <select
                className="border p-2 rounded w-full"
                defaultValue={setup.trend}
                onChange={(e) => (setup.trend = e.target.value)}
              >
                <option value="bullish">📈 Bullish</option>
                <option value="bearish">📉 Bearish</option>
                <option value="neutral">⚖️ Neutral</option>
              </select>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              💡 {setup.explanation}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleSave(setup.id, setup.name, setup.indicators, setup.trend)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                💾 Save
              </button>
              <button
                onClick={() => handleDelete(setup.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
