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

  // 🔁 Laad data bij mount of tabwissel
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // elke 60 sec refresh
    return () => clearInterval(interval);
  }, [activeTab]);

  // ✅ Hoofdfunctie om data op te halen
  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let data;

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

      // ✅ Filter alleen toegestane indicatoren (zoals in config)
      const allowedIndicators = ['rsi', 'volume', 'ma_200'];

      const enriched = data
        .filter((item) => allowedIndicators.includes(item.indicator?.toLowerCase()))
        .map((item) => ({
          indicator: item.indicator || '–',
          waarde: item.waarde ?? item.value ?? '–',
          score: parseFloat(item.score) ?? null,
          advies: item.advies || '–',
          uitleg: item.uitleg || 'Geen uitleg beschikbaar',
          symbol: item.symbol || '',
        }));

      setTechnicalData(enriched);

      // ✅ Haal backend-score op (totale technische score)
      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);
        setAdvies(
          backendScore >= 75 ? '🟢 Bullish' :
          backendScore <= 25 ? '🔴 Bearish' :
          '⚖️ Neutraal'
        );
      } else {
        // Fallback naar lokale berekening
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

  // 🧮 Fallback berekening (alleen als backend-score ontbreekt)
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
      avg >= 70 ? '🟢 Bullish' :
      avg <= 40 ? '🔴 Bearish' :
      '⚖️ Neutraal'
    );
  }

  // 🧠 Verwijderen van indicator (frontend only)
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
