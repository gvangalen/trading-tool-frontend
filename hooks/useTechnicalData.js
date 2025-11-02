'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  getAllRules,
  addNewRule,
  getIndicatorNames,
} from '@/lib/api/technical';
import { getDailyScores } from '@/lib/api/scores';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rules, setRules] = useState([]);
  const [indicatorNames, setIndicatorNames] = useState([]);

  useEffect(() => {
    loadData();
    loadRules();
    loadIndicatorNames(); // 🔹 Nieuw toegevoegd
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

      if (activeTab === 'Maand') {
        const grouped = groupByMonth(enriched);
        setTechnicalData(grouped);
      } else if (activeTab === 'Kwartaal') {
        const grouped = groupByQuarter(enriched);
        setTechnicalData(grouped);
      } else {
        setTechnicalData(enriched);
      }

      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);
        setAdvies(
          backendScore >= 75 ? '🟢 Bullish' : backendScore <= 25 ? '🔴 Bearish' : '⚖️ Neutraal'
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

  async function loadRules() {
    try {
      const data = await getAllRules();
      setRules(data);
    } catch (err) {
      console.error('Fout bij ophalen van regels:', err);
    }
  }

  async function loadIndicatorNames() {
    try {
      const data = await getIndicatorNames();
      setIndicatorNames(data);
    } catch (err) {
      console.error('Fout bij ophalen van indicatornamen:', err);
    }
  }

  async function submitRule(rule) {
    try {
      await addNewRule(rule);
      await loadRules();
    } catch (err) {
      console.error('Fout bij opslaan van regel:', err);
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
    setAdvies(avg >= 70 ? '🟢 Bullish' : avg <= 40 ? '🔴 Bearish' : '⚖️ Neutraal');
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
    rules,
    submitRule,
    indicatorNames, // ✅ dropdown names voor formulier
  };
}
