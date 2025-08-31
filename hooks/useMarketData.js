'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData,
  fetchMarketData7d,
  fetchInterpretedMarketData,
  deleteMarketAsset,
} from '@/lib/api/market';

export function useMarketData() {
  const [marketData, setMarketData] = useState([]);
  const [sevenDayData, setSevenDayData] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Elke minuut
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    console.group('📊 [MARKET HOOK] loadData gestart');

    try {
      // 🔹 1. Marktdata ophalen
      const data = await fetchMarketData();
      console.log('✅ [MARKET HOOK] Marktdata ontvangen:', data);

      if (!Array.isArray(data)) {
        console.warn('⛔️ [MARKET HOOK] Marktdata is geen array:', data);
        throw new Error('Marktdata ongeldig');
      }

      if (data.length === 0) {
        console.warn('⚠️ [MARKET HOOK] Marktdata is leeg');
      }

      setMarketData(data);
      updateScore(data);

      // 🔹 2. Historische data ophalen
      const historyData = await fetchMarketData7d();
      console.log('📅 [MARKET HOOK] Historische 7d data ontvangen:', historyData);

      if (!Array.isArray(historyData)) {
        console.warn('⛔️ [MARKET HOOK] Historische data is geen array:', historyData);
        throw new Error('Historische data ongeldig');
      }

      if (historyData.length === 0) {
        console.warn('⚠️ [MARKET HOOK] Historische data is leeg');
      }

      setSevenDayData(historyData);

      // 🔹 3. Interpretatie ophalen
      const interpreted = await fetchInterpretedMarketData();
      console.log('📈 [MARKET HOOK] Interpreteerde live data:', interpreted);

      if (!interpreted || typeof interpreted !== 'object') {
        console.warn('⚠️ [MARKET HOOK] Interpreteerde data ontbreekt of is ongeldig:', interpreted);
      }

      setLiveData(interpreted ?? null);

    } catch (err) {
      console.error('❌ [MARKET HOOK] Fout bij ophalen data:', err);
      setError('❌ Fout bij laden van marktdata');
      setMarketData([]);
      setSevenDayData([]);
      setLiveData(null);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
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
      console.warn('⚠️ [MARKET HOOK] updateScore: geen data om score te berekenen');
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      return;
    }

    const total = data.reduce((sum, asset) => sum + calculateMarketScore(asset), 0);
    const avg = (total / data.length).toFixed(1);
    console.log(`📊 [MARKET HOOK] Gemiddelde markt score berekend: ${avg}`);
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  async function deleteAsset(id) {
    try {
      await deleteMarketAsset(id);
      const updated = marketData.filter((a) => a.id !== id);
      setMarketData(updated);
      updateScore(updated);
      console.log(`🗑️ [MARKET HOOK] Asset verwijderd: ${id}`);
    } catch (err) {
      console.error('❌ [MARKET HOOK] Fout bij verwijderen asset:', err);
    }
  }

  return {
    marketData,
    sevenDayData,
    liveData,
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
