'use client';

export default function TechnicalDayTable({
  data,
  query,
  sortField,
  sortOrder,
  setQuery,
  setSortField,
  setSortOrder,
  deleteAsset,
}) {
  const filteredSorted = [...data]
    .filter((a) => a.symbol.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  return (
    <div className="space-y-4">
      {/* 🔹 Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Zoek asset"
          className="border p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* 🔹 Table */}
      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['symbol', 'rsi', 'volume', 'ma_200', 'score'].map((field) => (
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
          {filteredSorted.map((asset) => {
            const score = asset._score;
            const trend =
              score >= 1.5
                ? '🟢 Bullish'
                : score <= -1.5
                ? '🔴 Bearish'
                : '⚖️ Neutraal';
            const scoreColor =
              score >= 2
                ? 'text-green-600'
                : score <= -2
                ? 'text-red-600'
                : 'text-gray-600';

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
    </div>
  );
}
