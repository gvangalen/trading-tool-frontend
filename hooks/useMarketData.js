'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturns,
} from '@/lib/api/market';

export function useMarketData() {
  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);
  const [forwardReturns, setForwardReturns] = useState(null);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      const forward = await fetchForwardReturns();
      setForwardReturns(forward ?? null);

      // Optioneel: simpele logica voor demo-doeleinden
      const score = calculateAverageScore(history);
      setAvgScore(score);
      setAdvies(score >= 1.5 ? '🟢 Bullish' : score <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
    } catch (err) {
      console.error('❌ Fout bij laden:', err);
      setError('❌ Fout bij laden van marktdata');
    } finally {
      setLoading(false);
    }
  }

  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Fout bij ophalen live BTC:', err);
      setBtcLive(null);
    }
  }

  function calculateAverageScore(data) {
    if (!Array.isArray(data) || data.length === 0) return 'N/A';
    const total = data.reduce((sum, item) => {
      const change = item.change_24h ?? 0;
      if (change > 5) return sum + 2;
      if (change > 2) return sum + 1;
      if (change < -5) return sum - 2;
      if (change < -2) return sum - 1;
      return sum;
    }, 0);
    return (total / data.length).toFixed(1);
  }

  return {
    sevenDayData,
    forwardReturns,
    btcLive,
    avgScore,
    advies,
    loading,
    error,
  };
}
