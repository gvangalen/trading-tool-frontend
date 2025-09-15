'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  technicalDataDelete,
} from '@/lib/api/technical';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState({
    Dag: [],
    Week: [],
    Maand: [],
    Kwartaal: [],
  });
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // elke minuut
    return () => clearInterval(interval);
  }, [activeTab]);

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

      const list = Array.isArray(data) ? data : data?.technical_data || [];
      if (!Array.isArray(list)) throw new Error('technical_data is geen array');

      console.log(`📡 [useTechnicalData] ${activeTab} geladen:`, list);

      // Update only the relevant tab's data
      setTechnicalData((prev) => ({
        ...prev,
        [activeTab]: list,
      }));

      updateScore(list);
    } catch (err) {
      console.error('❌ Technische data ophalen mislukt:', err);
      setTechnicalData((prev) => ({
        ...prev,
        [activeTab]: [],
      }));
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden technische data');
    } finally {
      setLoading(false);
    }
  }

  function updateScore(data) {
    let total = 0;
    let count = 0;

    data.forEach((item) => {
      const score = typeof item.score === 'number' ? item.score : parseFloat(item.score);
      if (!isNaN(score)) {
        total += score;
        count++;
      } else {
        console.warn(`⚠️ Ongeldige score bij ${item.symbol || item.name}:`, item.score);
      }
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
    console.log('🗑️ Verzoek om te verwijderen:', symbol);
    try {
      await technicalDataDelete(symbol);
      const updated = technicalData[activeTab].filter((item) => item.symbol !== symbol);
      setTechnicalData((prev) => ({
        ...prev,
        [activeTab]: updated,
      }));
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
    deleteAsset,
  };
}
