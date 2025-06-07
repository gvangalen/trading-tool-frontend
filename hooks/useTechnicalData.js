'use client';

import { useEffect, useState } from 'react';
import { fetchTechnicalData, deleteTechnicalIndicator } from '@/lib/api/technical';

export function useTechnicalData() {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 🔁 elke 60 sec
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTechnicalData();
      const valid = Array.isArray(data) ? data : [];
      setTechnicalData(valid);
      updateScore(valid);
    } catch (err) {
      console.error('❌ Technische data ophalen mislukt:', err);
      setError('❌ Fout bij laden technische indicatoren');
      setTechnicalData([]);
    } finally {
      setLoading(false);
    }
  }

  function calculateTechnicalScore(item) {
    let score = 0;
    if (item.rsi < 30) score += 1;
    if (item.rsi > 70) score -= 1;
    if (item.volume > 500000000) score += 1;
    if (item.price > item.ma_200) score += 1;
    else score -= 1;

    return Math.max(-2, Math.min(2, score));
  }

  function updateScore(data) {
    let total = 0;
    let count = 0;
    data.forEach((d) => {
      const score = calculateTechnicalScore(d);
      if (!isNaN(score)) {
        total += score;
        count++;
      }
    });
    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  function getExplanation(field) {
    const uitleg = {
      rsi: 'RSI < 30 = oversold (bullish), > 70 = overbought (bearish).',
      volume: 'Hoger volume duidt op interesse in de asset.',
      ma_200: 'Boven 200MA is bullish, onder is bearish.',
    };
    return uitleg[field] || 'Geen uitleg beschikbaar';
  }

  async function deleteAsset(id) {
    try {
      await deleteTechnicalIndicator(id);
      const updated = technicalData.filter((item) => item.id !== id);
      setTechnicalData(updated);
      updateScore(updated);
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
      setError('❌ Verwijderen mislukt');
    }
  }

  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    query,
    sortField,
    sortOrder,
    timeframe,
    setQuery,
    setSortField,
    setSortOrder,
    setTimeframe,
    deleteAsset,
    calculateTechnicalScore,
    getExplanation,
  };
}
