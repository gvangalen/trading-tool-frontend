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
  deleteTechnicalIndicator,
} from '@/lib/api/technical';

import { getDailyScores } from '@/lib/api/scores';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  useEffect(() => {
    loadData();
    loadIndicatorNames();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // ============================================================
  // 📊 TECH DATA PER TIMEFRAME — exact parallel met macro hook
  // ============================================================
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
        name: item.indicator ?? '–',
        value: item.value ?? item.waarde ?? '–',
        score: item.score ?? null,
        advies: item.advies ?? null,
        uitleg: item.uitleg ?? null,
        timestamp: item.timestamp ?? null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      if (activeTab === 'Week') setTechnicalData(groupByDay(enriched));
      else if (activeTab === 'Maand') setTechnicalData(groupByMonth(enriched));
      else if (activeTab === 'Kwartaal') setTechnicalData(groupByQuarter(enriched));
      else setTechnicalData(enriched);

      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        setAvgScore(parseFloat(backendScore).toFixed(1));
        setAdvies(
          backendScore >= 75 ? '🟢 Bullish' :
          backendScore <= 25 ? '🔴 Bearish' :
          '⚖️ Neutraal'
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

  // ============================================================
  // 📚 Indicatorlijst ophalen
  // ============================================================
  async function loadIndicatorNames() {
    try {
      const list = await getIndicatorNames();
      setIndicatorNames(list);
    } catch (err) {
      console.error('❌ Fout bij ophalen indicatornamen:', err);
    }
  }

  // ============================================================
  // 🧠 Scoreregels — IDENTIEK aan macro hook
  // ============================================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error('❌ Fout bij ophalen scoreregels:', err);
    }
  }

  // ============================================================
  // ➕ Toevoegen (technicalDataAdd)
  // ============================================================
  async function addTechnicalIndicator(indicatorName) {
    try {
      const result = await technicalDataAdd(indicatorName);
      await loadData();
      return result;
    } catch (err) {
      console.error('❌ Fout bij addTechnicalIndicator:', err);
      throw err;
    }
  }

  // ============================================================
  // 🗑️ Verwijderen
  // ============================================================
  async function removeTechnicalIndicator(indicatorName) {
    if (!indicatorName) return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je '${indicatorName}' wilt verwijderen?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteTechnicalIndicator(indicatorName);
      alert(`✅ Indicator '${indicatorName}' verwijderd`);
      setTechnicalData((prev) =>
        prev.filter((item) => item.name !== indicatorName)
      );
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
      alert(`❌ Verwijderen van '${indicatorName}' mislukt`);
    }
  }

  // ============================================================
  // 🔢 Gemiddelde score berekenen
  // ============================================================
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

  // ============================================================
  // 📅 Groepering (week / maand / kwartaal)
  // ============================================================
  function groupByDay(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;

      const date = item.dateObj;
      const key = date.toISOString().slice(0, 10);

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped).map(([label, items]) => ({
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

    return Object.entries(grouped).map(([key, items]) => {
      const [year, month] = key.split('-');
      return { label: `📅 ${month} ${year}`, data: items };
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

    return Object.entries(grouped).map(([key, items]) => {
      const [year, quarter] = key.split('-Q');
      return {
        label: `📊 Kwartaal ${quarter} – ${year}`,
        data: items,
      };
    });
  }

  // ============================================================
  // EXPORT (zelfde naamstructuur als macro hook)
  // ============================================================
  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    indicatorNames,
    scoreRules,
    loadScoreRules,
    addTechnicalIndicator,
    removeTechnicalIndicator,
  };
}
