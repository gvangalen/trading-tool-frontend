'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData,
  fetchMarketData7d,
  fetchInterpretedMarketData, // ✅ Toegevoegd
  deleteMarketAsset,
} from '@/lib/api/market';

export function useMarketData() {
  const [marketData, setMarketData] = useState([]);
  const [sevenDayData, setSevenDayData] = useState([]);
  const [liveData, setLiveData] = useState(null); // ✅ Nieuw voor interpretatie
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // ⏱️ Elke minuut verversen
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    console.log('🚀 loadData gestart');

    try {
      // 📡 1. Marktdata
      const data = await fetchMarketData();
      const validData = Array.isArray(data) ? data : [];
      console.log('✅ Marktdata ontvangen:', validData);
      setMarketData(validData);
      updateScore(validData);

      // 📡 2. Historische 7d data
      const historyData = await fetchMarketData7d();
      const sevenDays = Array.isArray(historyData) ? historyData : [];
      console.log('📅 Historische 7d data:', sevenDays);
      setSevenDayData(sevenDays);

      // 📡 3. Live interpretatie ophalen
      const interpreted = await fetchInterpretedMarketData();
      console.log('📈 Live interpretatie ontvangen:', interpreted);
      setLiveData(interpreted ?? null);

    } catch (err) {
      console.warn('❌ Fout bij ophalen marktdata:', err);
      setError('❌ Fout bij laden van marktdata');
      setMarketData([]);
      setSevenDayData([]);
      setLiveData(null);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
    } finally {
      setLoading(false);
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
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
    }
  }

  return {
    marketData,
    sevenDayData,
    liveData,         // ✅ Nieuw veld in return
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
