'use client';
import { useEffect, useState } from 'react';

const API_URL = '/api/dashboard_data';

export default function MarketTable() {
  const [marketData, setMarketData] = useState([]);
  const [avgScore, setAvgScore] = useState('–');
  const [advies, setAdvies] = useState('⚖️ Neutraal');

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMarketData() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Fout bij ophalen dashboard_data");
      const data = await res.json();
      const market = data.market_data || [];
      setMarketData(market);
      updateMarketSummary(market);
    } catch (err) {
      console.error("❌ Marktdata laden mislukt:", err);
    }
  }

  function calculateMarketScore(asset) {
    let score = 0;
    const change = asset.change_24h ?? 0;
    const rsi = asset.rsi ?? 50;

    if (change > 2) score += 1;
    if (change > 5) score += 1;
    if (rsi < 30) score += 1;
    if (rsi > 70) score -= 1;
    if (asset.price > asset.ma_200) score += 1;
    else score -= 1;

    return Math.max(-2, Math.min(2, score));
  }

  function updateMarketSummary(data) {
    const total = data.reduce((sum, asset) => sum + calculateMarketScore(asset), 0);
    const count = data.length;
    const avg = count ? (total / count).toFixed(1) : '–';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

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
            return (
              <tr key={asset.symbol} className="border-t">
                <td className="p-2">{asset.symbol}</td>
                <td>{formatNumber(asset.price, true)}</td>
                <td>{formatChange(asset.change_24h)}</td>
                <td>{formatNumber(asset.volume)}</td>
                <td>{formatNumber(asset.rsi)}</td>
                <td>{formatPosition(asset.price, asset.ma_200)}</td>
                <td className="font-bold">{score}</td>
                <td>{asset.timestamp ? new Date(asset.timestamp).toLocaleTimeString() : "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
