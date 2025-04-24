// ✅ useTechnicalData.js — hook voor technische analyse
'use client';
import { useEffect, useState } from 'react';

export function useTechnicalData() {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function safeFetch(url) {
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fout bij ophalen van ${url}`);
        const data = await res.json();
        if (!data || !data.technical_data) throw new Error("Lege response");
        return data.technical_data;
      } catch (err) {
        console.error("❌ safeFetch:", err);
        retries--;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return [];
  }

  async function fetchData() {
    const data = await safeFetch('/api/dashboard_data');
    setTechnicalData(data);
    updateScore(data);
  }

  function calculateScore(item) {
    let score = 0;
    if (item.rsi < 30) score += 1;
    if (item.rsi > 70) score -= 1;
    if (item.volume > 500000000) score += 1;
    if (item.price > item.ma_200) score += 1;
    else score -= 1;
    return Math.max(-2, Math.min(2, score));
  }

  function updateScore(data) {
    let total = 0, count = 0;
    data.forEach(d => {
      const s = calculateScore(d);
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
  };
}
