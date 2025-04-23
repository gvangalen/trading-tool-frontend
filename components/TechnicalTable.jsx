'use client';
import { useEffect, useState } from 'react';

const API_BASE_URL = '/api/technical_data';

export default function TechnicalTable() {
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');
  const [timeframe, setTimeframe] = useState('4hr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await safeFetch(`${API_BASE_URL}?timeframe=${timeframe}`);
      if (!Array.isArray(data)) throw new Error('Ongeldige API-response');
      setAssets(data);
      updateScoreSummary(data);
    } catch (err) {
      console.error(err);
      setError('❌ Fout bij laden.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }

  async function safeFetch(url, method = "GET", body = null) {
    let retries = 3;
    while (retries > 0) {
      try {
        const options = { method, headers: { "Content-Type": "application/json" } };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Serverfout (${res.status})`);
        return method === "GET" ? await res.json() : true;
      } catch (err) {
        retries--;
        await new Promise(res => setTimeout(res, 1500));
      }
    }
    throw new Error("❌ Alle retries mislukt!");
  }

  function calculateScore(asset) {
    let score = 0;
    if (asset.rsi > 70) score -= 2;
    else if (asset.rsi > 55) score -= 1;
    else if (asset.rsi < 30) score += 2;
    else if (asset.rsi < 45) score += 1;

    if (asset.volume > 1_000_000_000) score += 1;
    if (asset.ma_200 < asset.price) score += 1;
    else score -= 1;

    return Math.max(-2, Math.min(2, score));
  }

  function updateScoreSummary(data) {
    const total = data.reduce((sum, a) => sum + calculateScore(a), 0);
    const avg = data.length ? (total / data.length).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze asset wilt verwijderen?")) return;
    await safeFetch(`${API_BASE_URL}/${id}`, "DELETE");
    loadData();
  }

  const filteredSorted = [...assets]
    .filter(a => a.symbol.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Zoek asset"
          className="border p-2 rounded"
          onChange={e => setQuery(e.target.value)}
        />
        <select
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="15m">15m</option>
          <option value="1hr">1h</option>
          <option value="4hr">4h</option>
          <option value="1d">1d</option>
        </select>
        {loading && <span className="text-sm text-gray-500">📡 Laden...</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <div className="text-sm text-gray-700">
        Gemiddelde score: <strong>{avgScore}</strong> | Advies: <strong>{advies}</strong>
      </div>

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['symbol', 'rsi', 'volume', 'ma_200', 'score'].map(field => (
              <th
                key={field}
                className="cursor-pointer p-2"
                onClick={() => {
                  setSortField(field);
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                {field.toUpperCase()}
              </th>
            ))}
            <th>Advies</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredSorted.map(asset => {
            const score = calculateScore(asset);
            const trend =
              score >= 1.5 ? '🟢 Bullish' : score <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal';
            return (
              <tr key={asset.id} className="border-t">
                <td className="p-2">{asset.symbol}</td>
                <td>{asset.rsi}</td>
                <td>{(asset.volume / 1e6).toFixed(1)}M</td>
                <td>{asset.ma_200}</td>
                <td>{score}</td>
                <td>{trend}</td>
                <td>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(asset.id)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
