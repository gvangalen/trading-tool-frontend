'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
} from '@/lib/api/technical';
import { getDailyScores } from '@/lib/api/scores';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let data;

      // 🔹 Data ophalen per timeframe
      switch (activeTab) {
        case 'Dag':
          data = await technicalDataDay();
          break;
        case 'Week':
          data = await technicalDataWeek();
          break;
        case 'Maand':
          data = await technicalDataMonth();
          break;
        case 'Kwartaal':
          data = await technicalDataQuarter();
          break;
        default:
          data = await technicalDataDay();
      }

      if (!Array.isArray(data)) throw new Error('Technische data is geen lijst');

      // 🔹 Data verrijken met fallbackwaarden
      const enriched = data.map((item) => ({
        indicator: item.indicator || '–',
        waarde: item.waarde ?? item.value ?? '–',
        score: parseFloat(item.score) ?? null,
        advies: item.advies || '–',
        uitleg: item.uitleg || 'Geen uitleg beschikbaar',
        symbol: item.symbol || '',
        timestamp: item.timestamp || null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      // ✅ Alleen groepeer bij maand/kwartaal, niet bij week!
      if (['Maand', 'Kwartaal'].includes(activeTab)) {
        const grouped = groupByWeek(enriched);
        setTechnicalData(grouped);
      } else {
        setTechnicalData(enriched);
      }

      // 🔹 Score ophalen uit backend
      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);
        setAdvies(
          backendScore >= 75
            ? '🟢 Bullish'
            : backendScore <= 25
            ? '🔴 Bearish'
            : '⚖️ Neutraal'
        );
      } else {
        updateScore(enriched);
      }
    } catch (err) {
      console.warn('⚠️ Technische data kon niet worden geladen:', err);
      setTechnicalData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van technische data');
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Bereken gemiddelde score
  function updateScore(data) {
    let total = 0;
    let count = 0;

    data.forEach((ind) => {
      const s = parseFloat(ind.score);
      if (!isNaN(s)) {
        total += s;
        count++;
      }
    });

    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(
      avg >= 70 ? '🟢 Bullish' : avg <= 40 ? '🔴 Bearish' : '⚖️ Neutraal'
    );
  }

  // 🔹 Data per week groeperen (voor Maand en Kwartaal)
  function groupByWeek(data) {
    const grouped = {};

    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getUTCFullYear();
      const week = getWeekNumber(item.dateObj);
      const key = `${year}-W${week}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    // Sorteer en maak nette labels
    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({
        label: `Week ${key.split('-W')[1]} – ${key.split('-W')[0]}`,
        data: items,
      }));
  }

  // 🔹 Weeknummer berekenen
  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  // 🔹 Verwijderen
  function handleRemove(symbol) {
    const updated = technicalData.filter((item) => item.symbol !== symbol);
    setTechnicalData(updated);
  }

  return {
    technicalData,
    avgScore,
    advies,
    handleRemove,
    loading,
    error,
  };
}
