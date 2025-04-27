'use client';

import { useTechnicalData } from '@/hooks/useTechnicalData';
import SkeletonTable from '@/components/SkeletonTable'; // ✅ Vergeet deze import niet!

export default function TechnicalTable() {
  const {
    technicalData,
    query,
    sortField,
    sortOrder,
    timeframe,
    avgScore,
    advies,
    loading,
    error,
    setQuery,
    setSortField,
    setSortOrder,
    setTimeframe,
    deleteAsset
  } = useTechnicalData();

  const filteredSorted = [...technicalData]
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
          value={query}
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
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={7} />
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <>
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
                const score = asset._score;
                const trend = score >= 1.5 ? '🟢 Bullish' : score <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal';
                const scoreColor =
                  score >= 2 ? 'text-green-600' :
                  score <= -2 ? 'text-red-600' :
                  'text-gray-600';

                return (
                  <tr key={asset.id} className="border-t">
                    <td className="p-2">{asset.symbol}</td>
                    <td>{asset.rsi}</td>
                    <td>{(asset.volume / 1e6).toFixed(1)}M</td>
                    <td>{asset.ma_200}</td>
                    <td className={`font-bold ${scoreColor}`}>{score}</td>
                    <td>{trend}</td>
                    <td>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => deleteAsset(asset.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
