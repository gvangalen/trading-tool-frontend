'use client';

import { useMarketData } from '@/hooks/useMarketData';
import SkeletonTable from '@/components/ui/SkeletonTable';

export default function MarketTable() {
  const {
    marketData,
    loading,
    error,
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

  if (loading) return <SkeletonTable rows={4} columns={5} />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Asset</th>
              <th>Prijs</th>
              <th>24u %</th>
              <th>Volume</th>
              <th>🕒 Laatste update</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((asset) => (
              <tr key={asset.symbol} className="border-t">
                <td className="p-2">{asset.symbol}</td>
                <td>{formatNumber(asset.price, true)}</td>
                <td>{formatChange(asset.change_24h)}</td>
                <td>{formatNumber(asset.volume)}</td>
                <td>{asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
