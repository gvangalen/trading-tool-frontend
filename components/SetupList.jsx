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
    <div className="space-y-4 mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">🔁 All Trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutral</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">🔤 Sort by Name</option>
        </select>
      </div>

      <ul className="space-y-3">
        {setups.map((setup) => (
          <li key={setup.id} className="p-3 border rounded bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <input
                className="border p-1 rounded w-full md:w-1/4"
                defaultValue={setup.name}
                onChange={(e) => (setup.name = e.target.value)}
              />
              <input
                className="border p-1 rounded w-full md:w-1/3"
                defaultValue={setup.indicators}
                onChange={(e) => (setup.indicators = e.target.value)}
              />
              <select
                className="border p-1 rounded"
                defaultValue={setup.trend}
                onChange={(e) => (setup.trend = e.target.value)}
              >
                <option value="bullish">📈 Bullish</option>
                <option value="bearish">📉 Bearish</option>
                <option value="neutral">⚖️ Neutral</option>
              </select>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => handleSave(setup.id, setup.name, setup.indicators, setup.trend)}
                  className="text-green-700 hover:underline"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => handleDelete(setup.id)}
                  className="text-red-600 hover:underline"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">💡 {setup.explanation}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
