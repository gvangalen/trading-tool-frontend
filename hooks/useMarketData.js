'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData,
  fetchMarketData7d,
  fetchInterpretedMarketData,
  deleteMarketAsset,
  fetchLatestBTC,
  fetchForwardReturns, // ✅ Toegevoegd
} from '@/lib/api/market';

export function useMarketData() {
  const [marketData, setMarketData] = useState([]);
  const [sevenDayData, setSevenDayData] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [latestBTC, setLatestBTC] = useState(null);
  const [liveBTC, setLiveBTC] = useState(null);
  const [forwardReturns, setForwardReturns] = useState(null); // ✅ Nieuw
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  // 🔁 Initieel laden en interval
  useEffect(() => {
    loadData();
    loadLatestBTC();
    const interval = setInterval(() => {
      loadLatestBTC();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadLatestBTC() {
    try {
      const data = await fetchLatestBTC();
      console.log('🟢 [MARKET HOOK] Live BTC ontvangen:', data);
      setLiveBTC(data);
    } catch (err) {
      console.error('❌ [MARKET HOOK] Fout bij ophalen live BTC:', err);
      setLiveBTC(null);
    }
  }

  async function loadData() {
    setLoading(true);
    setError('');
    console.group('📊 [MARKET HOOK] loadData gestart');

    try {
      const data = await fetchMarketData();
      console.log('✅ Marktdata:', data);
      setMarketData(data);
      updateScore(data);

      const btc = data.find(a => a.symbol === 'BTC');
      setLatestBTC(btc ?? null);

      const historyData = await fetchMarketData7d();
      console.log('📅 Historische data:', historyData);
      setSevenDayData(historyData);

      const interpreted = await fetchInterpretedMarketData();
      setLiveData(interpreted ?? null);

      const forward = await fetchForwardReturns(); // ✅ ophalen
      console.log('📈 Forward returns:', forward);
      setForwardReturns(forward ?? null);

    } catch (err) {
      console.error('❌ Fout bij loadData:', err);
      setError('❌ Fout bij laden van marktdata');
      setMarketData([]);
      setSevenDayData([]);
      setLiveData(null);
      setLatestBTC(null);
      setForwardReturns(null); // ✅ resetten bij fout
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  }

  function calculateMarketScore(asset) {
    let score = 0;
    const change = asset.change_24h ?? 0;
    if (change > 5) score += 2;
    else if (change > 2) score += 1;
    else if (change < -5) score -= 2;
    else if (change < -2) score -= 1;
    return Math.max(-2, Math.min(2, score));
  }

  function updateScore(data) {
    if (!Array.isArray(data) || data.length === 0) {
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      return;
    }

    const total = data.reduce((sum, asset) => sum + calculateMarketScore(asset), 0);
    const avg = (total / data.length).toFixed(1);
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  async function deleteAsset(id) {
    try {
      await deleteMarketAsset(id);
      const updated = marketData.filter((a) => a.id !== id);
      setMarketData(updated);
      updateScore(updated);
      const btc = updated.find(a => a.symbol === 'BTC');
      setLatestBTC(btc ?? null);
    } catch (err) {
      console.error('❌ Fout bij verwijderen asset:', err);
    }
  }

  return {
    marketData,
    sevenDayData,
    liveData,
    latestBTC,
    liveBTC,
    forwardReturns, // ✅ toegevoegd aan return
    avgScore,
    advies,
    loading,
    error,
    query,
    sortField,
    sortOrder,
    setQuery,
    setSortField,
    setSortOrder,
    calculateMarketScore,
    deleteAsset,
  };
}
