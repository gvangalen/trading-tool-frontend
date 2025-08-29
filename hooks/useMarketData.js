'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData,
  fetchMarketData7d, // ✅ Nieuwe import
  deleteMarketAsset,
} from '@/lib/api/market';

export function useMarketData() {
  const [marketData, setMarketData] = useState([]);
  const [sevenDayData, setSevenDayData] = useState([]); // 📅 extra hook state
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // ⏱️ elke minuut vernieuwen
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      // 📡 1. Huidige marktdata ophalen
      const data = await fetchMarketData();
      const validData = Array.isArray(data) ? data : [];
      setMarketData(validData);
      updateScore(validData);

      // 📡 2. 7-daagse data ophalen via API helper
      const historyData = await fetchMarketData7d();
      setSevenDayData(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.warn('⚠️ Marktdata ophalen mislukt:', err);
      setError('❌ Fout bij laden van marktdata');
      setMarketData([]);
      setSevenDayData([]);
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
    sevenDayData,     // 📤 beschikbaar in je component
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
