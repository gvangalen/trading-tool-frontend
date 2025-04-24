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

      if (filter !== 'all') list = list.filter(s => s.trend === filter);
      if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

      // Voeg AI-uitleg toe
      const withExplanations = await Promise.all(list.map(async s => ({
        ...s,
        explanation: await getExplanation(s)
      })));

      setSetups(withExplanations);
    } catch {
      setSetups([{ name: '⚠️ Fout bij laden', indicators: '', trend: '', explanation: '...' }]);
    }
  }

  async function getExplanation(setup) {
    try {
      const res = await fetch('/api/ai/explain_setup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setup)
      });
      const data = await res.json();
      return data.explanation || 'Geen uitleg.';
    } catch {
      return 'AI-uitleg mislukt.';
    }
  }

  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze setup wilt verwijderen?")) return;
    await fetch(`/api/setups/${id}`, { method: 'DELETE' });
    loadSetups();
  }

  async function handleSave(id, name, indicators, trend) {
    if (!name || !indicators || !trend) {
      alert("⚠️ Vul alle velden correct in.");
      return;
    }
    await fetch(`/api/setups/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, indicators, trend })
    });
    loadSetups();
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">🔁 Alle trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="name">🔤 Sorteer op naam</option>
        </select>
      </div>

      <ul className="space-y-3">
        {setups.map(setup => (
          <li key={setup.id} className="p-3 border rounded bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <input
                className="border p-1 rounded w-full md:w-1/4"
                defaultValue={setup.name}
                onChange={e => setup.name = e.target.value}
              />
              <input
                className="border p-1 rounded w-full md:w-1/3"
                defaultValue={setup.indicators}
                onChange={e => setup.indicators = e.target.value}
              />
              <select
                className="border p-1 rounded"
                defaultValue={setup.trend}
                onChange={e => setup.trend = e.target.value}
              >
                <option value="bullish">📈</option>
                <option value="bearish">📉</option>
                <option value="neutral">⚖️</option>
              </select>

              <div className="flex gap-2 ml-auto">
                <button onClick={() => handleSave(setup.id, setup.name, setup.indicators, setup.trend)} className="text-green-700 hover:underline">💾</button>
                <button onClick={() => handleDelete(setup.id)} className="text-red-600 hover:underline">❌</button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">💡 {setup.explanation}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
