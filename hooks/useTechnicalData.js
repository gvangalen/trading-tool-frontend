'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataAll,
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  technicalDataDelete,
} from '@/lib/api/technical';

export function useTechnicalData() {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('day'); // 'day' | 'week' | 'month' | 'quarter'

  useEffect(() => {
    console.log('⏱️ Timeframe gewijzigd:', timeframe);
    loadData();
    const interval = setInterval(loadData, 60000); // 🔁 elke 60 sec refresh
    return () => clearInterval(interval);
  }, [timeframe]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let data;
      switch (timeframe) {
        case 'day':
          data = await technicalDataDay();
          break;
        case 'week':
          data = await technicalDataWeek();
          break;
        case 'month':
          data = await technicalDataMonth();
          break;
        case 'quarter':
          data = await technicalDataQuarter();
          break;
        default:
          data = await technicalDataAll(); // fallback
      }

      const items = Array.isArray(data) ? data : [];
      setTechnicalData(items);
      updateScore(items); // 🔁 backend-score gebruiken
    } catch (err) {
      console.error('❌ Technische data ophalen mislukt:', err);
      setTechnicalData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('❌ Fout bij laden technische data');
    } finally {
      setLoading(false);
    }
  }

  function updateScore(data) {
    let total = 0;
    let count = 0;

    data.forEach((item) => {
      const sumScore =
        (item.rsi_score ?? 0) +
        (item.volume_score ?? 0) +
        (item.ma_200_score ?? 0);

      total += sumScore;
      count++;
    });

    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(
      avg >= 1.5 ? '🟢 Bullish' :
      avg <= -1.5 ? '🔴 Bearish' :
      '⚖️ Neutraal'
    );
  }

  async function deleteAsset(symbol) {
    try {
      await technicalDataDelete(symbol);
      const updated = technicalData.filter((item) => item.symbol !== symbol);
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
    timeframe,
    setTimeframe,
    deleteAsset,
  };
}
