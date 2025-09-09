'use client';

import { useEffect, useState } from 'react';
import {
  fetchMacroDataDay,
  fetchMacroDataWeek,
  fetchMacroDataMonth,
  fetchMacroDataQuarter,
} from '@/lib/api/macro';

export function useMacroData(activeTab = 'Dag') {
  const [macroData, setMacroData] = useState([]);
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
      switch (activeTab) {
        case 'Dag':
          data = await fetchMacroDataDay();
          break;
        case 'Week':
          data = await fetchMacroDataWeek();
          break;
        case 'Maand':
          data = await fetchMacroDataMonth();
          break;
        case 'Kwartaal':
          data = await fetchMacroDataQuarter();
          break;
        default:
          data = await fetchMacroDataDay();
      }

      const macro = data?.macro_data || data || [];
      if (!Array.isArray(macro)) throw new Error('macro_data is geen lijst');

      setMacroData(macro);
      updateScore(macro);
      markStepDone(3);
    } catch (err) {
      console.warn('⚠️ Macrodata kon niet worden geladen:', err);
      setMacroData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van macrodata');
    } finally {
      setLoading(false);
    }
  }

  function calculateMacroScore(name, value) {
    if (name === "fear_greed_index") return value > 75 ? 2 : value > 55 ? 1 : value < 30 ? -2 : value < 45 ? -1 : 0;
    if (name === "btc_dominance") return value > 55 ? 2 : value > 50 ? 1 : value < 45 ? -2 : value < 48 ? -1 : 0;
    if (name === "dxy") return value < 100 ? 2 : value < 103 ? 1 : value > 107 ? -2 : value > 104 ? -1 : 0;
    return 0;
  }

  function getExplanation(name) {
    const uitleg = {
      fear_greed_index: "Lage waarde = angst, hoge waarde = hebzucht.",
      btc_dominance: "Hoge dominantie = minder altcoin-risico.",
      dxy: "Lage DXY = gunstig voor crypto."
    };
    return uitleg[name] || "Geen uitleg beschikbaar";
  }

  function updateScore(data) {
    let total = 0;
    let count = 0;
    data.forEach((ind) => {
      const score = calculateMacroScore(ind.name, parseFloat(ind.value));
      if (!isNaN(score)) {
        total += score;
        count++;
      }
    });
    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  function markStepDone(step) {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    fetch(`/api/onboarding_progress/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step }),
    }).catch(() => {
      console.warn('⚠️ Onboarding progress kon niet worden opgeslagen');
    });
  }

  function handleEdit(name, newValue) {
    const updated = macroData.map((ind) =>
      ind.name === name ? { ...ind, value: parseFloat(newValue) } : ind
    );
    setMacroData(updated);
    updateScore(updated);
  }

  function handleRemove(name) {
    const updated = macroData.filter((ind) => ind.name !== name);
    setMacroData(updated);
    updateScore(updated);
  }

  return {
    macroData,
    avgScore,
    advies,
    handleEdit,
    handleRemove,
    calculateMacroScore,
    getExplanation,
    loading,
    error,
  };
}
