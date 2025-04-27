'use client';

import { useMarketData } from '@/hooks/useMarketData';
import SkeletonTable from '@/components/SkeletonTable'; // ✅ Vergeet deze import niet!

export default function MarketTable() {
  const {
    marketData,
    avgScore,
    advies,
    loading,
    error,
    calculateMarketScore,
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

  function formatPosition(price, ma200) {
    if (!price || !ma200) return "–";
    return price > ma200 ? "✅ Boven 200MA" : "❌ Onder 200MA";
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <SkeletonTable rows={6} columns={7} />
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
                <th>Asset</th>
                <th>Prijs</th>
                <th>24h %</th>
                <th>Volume</th>
                <th>RSI</th>
                <th>200MA Positie</th>
                <th>Score</th>
                <th>🕒 Laatste update</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((asset) => {
                const score = calculateMarketScore(asset);
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
                    <td>{formatNumber(asset.rsi)}</td>
                    <td>{formatPosition(asset.price, asset.ma_200)}</td>
                    <td className={`font-bold ${scoreColor}`}>{score}</td>
                    <td>{asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : "–"}</td>
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
