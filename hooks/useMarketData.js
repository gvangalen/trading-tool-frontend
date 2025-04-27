'use client';
import { useEffect, useState } from 'react';
import { fetchMarketData } from '@/lib/api/market'; // Correcte import!

export function useMarketData() {
  const [marketData, setMarketData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMarketData();
      setMarketData(data || []);
      updateScore(data || []);
    } catch (err) {
      console.error('❌ Marktdata ophalen mislukt:', err);
      setError('❌ Fout bij laden van marktdata');
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  }

  function calculateMarketScore(asset) {
    let score = 0;
    const change = asset.change_24h ?? 0;
    const rsi = asset.rsi ?? 50;

    if (change > 5) score += 2;
    else if (change > 2) score += 1;
    if (rsi < 30) score += 1;
    if (rsi > 70) score -= 1;
    if (asset.price > asset.ma_200) score += 1;
    else score -= 1;

    return Math.max(-2, Math.min(2, score)); // Clamp tussen -2 en +2
  }

  function updateScore(data) {
    const total = data.reduce((sum, asset) => sum + calculateMarketScore(asset), 0);
    const avg = data.length ? (total / data.length).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  return {
    marketData,
    avgScore,
    advies,
    loading,
    error,
    calculateMarketScore,
  };
}
