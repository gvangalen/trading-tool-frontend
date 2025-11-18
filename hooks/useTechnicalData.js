'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  getIndicatorNames,
  getScoreRulesForIndicator,
  technicalDataAdd,
} from '@/lib/api/technical';

import { getDailyScores } from '@/lib/api/scores';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔍 Indicatorlijst voor zoekbalk
  const [indicatorNames, setIndicatorNames] = useState([]);

  // 🧠 Scoreregels
  const [scoreRules, setScoreRules] = useState([]);

  // ============================================
  // INIT
  // ============================================
  useEffect(() => {
    loadData();
    loadIndicatorNames();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // ============================================
  // 📊 1 — DATA LADEN PER TAB
  // ============================================
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

      if (!Array.isArray(data)) throw new Error('Technische data is geen lijst.');

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
        setTechnicalData(groupByMonth(enriched));
      } else if (activeTab === 'Kwartaal') {
        setTechnicalData(groupByQuarter(enriched));
      } else {
        setTechnicalData(enriched);
      }

      // Totale technische score ophalen
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

  // ============================================
  // 📚 2 — Indicatornamen ophalen
  // ============================================
  async function loadIndicatorNames() {
    try {
      const data = await getIndicatorNames(); // 👈 haalt op uit /api/technical/indicator_names
      setIndicatorNames(data);
    } catch (err) {
      console.error('❌ Fout bij ophalen van indicatornamen:', err);
    }
  }

  // ============================================
  // 🧠 3 — Scoreregels voor één indicator
  // ============================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error('❌ Fout bij ophalen scoreregels:', err);
    }
  }

  // ============================================
  // ➕ 4 — Indicator toevoegen
  // ============================================
  async function addTechnicalData(indicatorName) {
    try {
      const result = await technicalDataAdd(indicatorName);
      console.log('✅ Indicator toegevoegd:', result);

      await loadData(); // tabel refreshen
      return result;
    } catch (err) {
      console.error('❌ Fout bij toevoegen indicator:', err);
      throw err;
    }
  }

  // ============================================
  // 🔢 5 — Gemiddelde score
  // ============================================
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

  // ============================================
  // 🗂️ 6 — Grouping (Maand / Kwartaal)
  // ============================================
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
        return {
          label: `📅 ${getMonthName(month)} ${year}`,
          data: items,
        };
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
    return maanden[parseInt(monthNum, 10) - 1];
  }

  // ============================================
  // 🗑 7 — Verwijderen vanuit tabel
  // ============================================
  function handleRemove(indicatorName) {
    const updated = technicalData.filter(
      (item) => item.indicator !== indicatorName
    );
    setTechnicalData(updated);
  }

  // ============================================
  // EXPORT
  // ============================================
  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,

    // Zoek & logica
    indicatorNames,
    scoreRules,
    loadScoreRules,

    // Acties
    addTechnicalData,
    handleRemove,
  };
}
