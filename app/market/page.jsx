'use client';

import { useMarketData } from '@/hooks/useMarketData';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MarketPage() {
  const { marketData, loading, error } = useMarketData();

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">💰 Market Data</h1>

      <CardWrapper>
        {/* 🔄 Status */}
        {loading && <p className="text-gray-500 text-sm">📡 Data wordt geladen...</p>}
        {error && <p className="text-red-500 text-sm">❌ {error}</p>}

        {/* 📈 Markt Tabel */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
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
                  <tr key={asset.symbol} className="border-t dark:border-gray-700">
                    <td className="p-2 font-medium">{asset.symbol}</td>
                    <td className="p-2">
                      {asset.price ? `$${Number(asset.price).toFixed(2)}` : '–'}
                    </td>
                    <td className="p-2">
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
        )}
      </CardWrapper>
    </div>
  );
}
