'use client';
import { useEffect, useState } from 'react';
import { fetchTechnicalData } from '@/lib/api/technical'; // Correcte import

export function useTechnicalData() {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const data = await fetchTechnicalData();
      setTechnicalData(data || []);
      updateScore(data || []);
    } catch (err) {
      console.error('❌ Technische data ophalen mislukt:', err);
      setTechnicalData([]);
    }
  }

  function calculateTechnicalScore(item) {
    let score = 0;
    if (item.rsi < 30) score += 1;
    if (item.rsi > 70) score -= 1;
    if (item.volume > 500000000) score += 1;
    if (item.price > item.ma_200) score += 1;
    else score -= 1;
    return Math.max(-2, Math.min(2, score)); // Clamp tussen -2 en +2
  }

  function updateScore(data) {
    let total = 0;
    let count = 0;
    data.forEach(d => {
      const s = calculateTechnicalScore(d);
      if (!isNaN(s)) {
        total += s;
        count++;
      }
    });
    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  function removeIndicator(symbol) {
    const updated = technicalData.filter(d => d.symbol !== symbol);
    setTechnicalData(updated);
    updateScore(updated);
  }

  return {
    technicalData,
    avgScore,
    advies,
    removeIndicator,
    calculateTechnicalScore,
  };
}
