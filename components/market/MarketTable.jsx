'use client';
import { useMarketData } from '@/hooks/useMarketData';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function MarketTable() {
  const {
    marketData,
    avgScore,
    advies,
    loading,
    error,
    calculateMarketScore,
    query,
    sortField,
    sortOrder,
    setQuery,
    setSortField,
    setSortOrder,
    deleteAsset,
  } = useMarketData();

  function formatChange(change) {
    if (change === null || change === undefined) return "–";
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{change.toFixed(2)}%</span>;
  }

  function formatNumber(num, isPrice = false) {
    if (num === null || num === "N/A") return "–";
    return isPrice ? `$${Number(num).toFixed(2)}` : Number(num).toLocaleString();
  }

  const filteredSorted = [...marketData]
    .filter((a) => a.symbol.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  if (loading) return <SkeletonTable rows={6} columns={6} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {/* 🔹 Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Zoek asset"
          className="border p-2 rounded"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* 🔹 Score Summary */}
      <div className="text-sm text-gray-700">
        Gemiddelde score: <strong>{avgScore}</strong> | Advies: <strong>{advies}</strong>
      </div>

      {/* 🔹 Market Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              {['symbol', 'price', 'change_24h', 'volume'].map(field => (
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
              <th>Score</th>
              <th>Advies</th>
              <th>🕒 Laatste update</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSorted.map((asset) => {
              const score = calculateMarketScore(asset);
              const trend =
                score >= 1.5 ? '🟢 Bullish' :
                score <= -1.5 ? '🔴 Bearish' :
                '⚖️ Neutraal';
              const scoreColor =
                score >= 2 ? 'text-green-600' :
                score <= -2 ? 'text-red-600' :
                'text-gray-600';

              return (
                <tr key={asset.symbol} className="border-t">
                  <td className="p-2">{asset.symbol}</td>
                  <td>{formatNumber(asset.price, true)}</td>
                  <td>{formatChange(asset.change_24h)}</td>
                  <td>{formatNumber(asset.volume)}</td>
                  <td className={`font-bold ${scoreColor}`}>{score}</td>
                  <td>{trend}</td>
                  <td>{asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : "–"}</td>
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
      </div>
    </div>
  );
}
