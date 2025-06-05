'use client';
import { useMarketData } from '@/hooks/useMarketData';

export default function MarketPage() {
  const { marketData, loading, error } = useMarketData();

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📊 Market Data</h2>

      {/* 🔄 Statusweergave */}
      {loading && <p className="text-gray-600">📡 Laden van data...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {/* 📈 Markt Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Asset</th>
              <th className="p-2">💰 Prijs</th>
              <th className="p-2">📉 24u %</th>
              <th className="p-2">📊 Volume</th>
              <th className="p-2">⏱️ Laatste update</th>
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
                <td className="p-2">
                  {asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
