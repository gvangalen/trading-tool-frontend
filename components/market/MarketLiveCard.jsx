'use client';

export default function MarketLiveCard({ price, change24h, volume, timestamp }) {
  const color = change24h >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="border p-4 rounded shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">🟢 Live BTC Prijs</h2>
      <div className="text-3xl font-mono">${price?.toFixed(2) ?? '–'}</div>
      <div className="text-sm">📉 24u verandering: <span className={color}>{change24h?.toFixed(2)}%</span></div>
      <div className="text-sm">📊 Volume: {volume?.toLocaleString() ?? '–'}</div>
      <div className="text-xs text-gray-500 mt-2">⏱ Laatste update: {timestamp ? new Date(timestamp).toLocaleTimeString() : '–'}</div>
    </div>
  );
}
