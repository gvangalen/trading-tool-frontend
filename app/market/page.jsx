'use client';
import { useMarketData } from '@/hooks/useMarketData';

export default function MarketPage() {
  const { marketData, avgScore, advies, loading, error } = useMarketData();

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📊 Market Data</h2>

      {/* Status */}
      {loading && <p className="text-gray-600">📡 Loading data...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {/* Samenvatting */}
      <div className="text-sm">
        <strong>Average score:</strong> <span className="text-green-600">{avgScore}</span> |
        <strong> Advice:</strong> <span className="text-blue-600">{advies}</span>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Asset</th>
              <th className="p-2">💰 Price</th>
              <th className="p-2">📉 24h %</th>
              <th className="p-2">📊 Volume</th>
              <th className="p-2">📈 RSI</th>
              <th className="p-2">📏 200MA Position</th>
              <th className="p-2">🧠 Score</th>
              <th className="p-2">⏱️ Last Update</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((asset) => (
              <tr key={asset.symbol} className="border-t">
                <td className="p-2">{asset.symbol}</td>
                <td className="p-2">{asset.price ? `$${Number(asset.price).toFixed(2)}` : '–'}</td>
                <td className="p-2 text-right">
                  {asset.change_24h !== undefined ? (
                    <span className={asset.change_24h >= 0 ? 'text-green-600' : 'text-red-500'}>
                      {asset.change_24h.toFixed(2)}%
                    </span>
                  ) : '–'}
                </td>
                <td className="p-2">{asset.volume ? Number(asset.volume).toLocaleString() : '–'}</td>
                <td className="p-2">{asset.rsi ?? '–'}</td>
                <td className="p-2">{asset.price > asset.ma_200 ? '✅ Above 200MA' : '❌ Below 200MA'}</td>
                <td className="p-2 font-bold">{asset.score ?? '-'}</td>
                <td className="p-2">{asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
