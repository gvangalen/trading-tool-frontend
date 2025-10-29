'use client';

import { useEffect, useState } from 'react';
import {
  fetchMacroDataByDay,
  fetchMacroDataByWeek,
  fetchMacroDataByMonth,
  fetchMacroDataByQuarter,
} from '@/lib/api/macro';
import { getDailyScores } from '@/lib/api/scores';

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
          data = await fetchMacroDataByDay();
          break;
        case 'Week':
          data = await fetchMacroDataByWeek();
          break;
        case 'Maand':
          data = await fetchMacroDataByMonth();
          break;
        case 'Kwartaal':
          data = await fetchMacroDataByQuarter();
          break;
        default:
          data = await fetchMacroDataByDay();
      }

      if (!Array.isArray(data)) throw new Error('Macrodata is geen lijst');

      const enriched = data.map((item) => ({
        indicator: item.indicator || item.name || '–',
        waarde: item.waarde ?? item.value ?? '–',
        score: parseFloat(item.score) ?? null,
        advies: item.advies || '–',
        uitleg: item.uitleg || 'Geen uitleg beschikbaar',
        symbol: item.symbol || '',
        timestamp: item.timestamp || null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      if (activeTab === 'Week') {
        const grouped = groupByDay(enriched);
        setMacroData(grouped);
      } else if (activeTab === 'Maand') {
        const grouped = groupByMonth(enriched);
        setMacroData(grouped);
      } else if (activeTab === 'Kwartaal') {
        const grouped = groupByQuarter(enriched);
        setMacroData(grouped);
      } else {
        setMacroData(enriched);
      }

      const scores = await getDailyScores();
      const backendScore = scores?.macro_score ?? null;

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
      console.warn('⚠️ Macrodata kon niet worden geladen:', err);
      setMacroData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van macrodata');
    } finally {
      setLoading(false);
    }
  }

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

  function groupByDay(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const dag = item.dateObj.toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!grouped[dag]) grouped[dag] = [];
      grouped[dag].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => new Date(b[1][0].timestamp) - new Date(a[1][0].timestamp))
      .map(([label, items]) => ({
        label: `📅 ${label}`,
        data: items,
      }));
  }

  function groupByMonth(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getFullYear();
      const month = item.dateObj.getMonth() + 1;
      const key = `${year}-${month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => {
        const [year, month] = key.split('-');
        const label = `📅 ${getMonthName(month)} ${year}`;
        return { label, data: items };
      });
  }

  function groupByQuarter(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getFullYear();
      const quarter = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${year}-Q${quarter}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({
        label: `📊 Kwartaal ${key.split('-Q')[1]} – ${key.split('-Q')[0]}`,
        data: items,
      }));
  }

  function getMonthName(monthNum) {
    const maanden = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
    ];
    return maanden[parseInt(monthNum, 10) - 1] || 'Onbekend';
  }

  function handleRemove(symbol) {
    const updated = macroData.filter((item) => item.symbol !== symbol);
    setMacroData(updated);
  }

  return {
    macroData,
    avgScore,
    advies,
    handleRemove,
    loading,
    error,
  };
}
