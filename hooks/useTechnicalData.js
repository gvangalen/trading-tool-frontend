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
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  useEffect(() => {
    loadData();
    loadIndicatorNames();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);


  // =========================================================
  // 📊 Load Technical Data
  // =========================================================
  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let data;

      switch (activeTab) {
        case 'Dag': data = await technicalDataDay(); break;
        case 'Week': data = await technicalDataWeek(); break;
        case 'Maand': data = await technicalDataMonth(); break;
        case 'Kwartaal': data = await technicalDataQuarter(); break;
        default: data = await technicalDataDay();
      }

      if (!Array.isArray(data)) throw new Error('Technische data is geen lijst');

      // =========================================================
      // 🧠 BELANGRIJK: Backend → Frontend uniformeren
      // =========================================================
      const enriched = data.map((item) => ({
        indicator: item.indicator || item.name || '–',   // FIXED
        value: item.value ?? item.waarde ?? '–',          // FIXED
        score: item.score ?? null,
        advies: item.advies ?? item.action ?? '–',        // FIXED
        uitleg: item.uitleg ?? item.interpretation ?? '–', // FIXED
        symbol: item.symbol ?? '',
        timestamp: item.timestamp ?? null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      if (activeTab === 'Maand') setTechnicalData(groupByMonth(enriched));
      else if (activeTab === 'Kwartaal') setTechnicalData(groupByQuarter(enriched));
      else setTechnicalData(enriched);

      // =========================================================
      // 🟢 Total technical score (from daily_scores API)
      // =========================================================
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
      }
    } catch (err) {
      console.warn('⚠️ Technische data fout:', err);
      setTechnicalData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van technische data');
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // 📚 Indicator Names
  // =========================================================
  async function loadIndicatorNames() {
    try {
      const data = await getIndicatorNames();
      setIndicatorNames(data);
    } catch (err) {
      console.error('❌ Fout bij indicator namen:', err);
    }
  }


  // =========================================================
  // 🧠 Score Rules Logic
  // =========================================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error('❌ Fout bij scoreregels:', err);
    }
  }


  // =========================================================
  // ➕ Add Indicator
  // =========================================================
  async function addTechnicalData(indicatorName) {
    try {
      const result = await technicalDataAdd(indicatorName);
      await loadData();
      return result;
    } catch (err) {
      console.error('❌ addTechnicalData error:', err);
      throw err;
    }
  }


  // =========================================================
  // 🧹 Remove handler (frontend only)
  // =========================================================
  function handleRemove(indicatorName) {
    setTechnicalData((prev) =>
      prev.filter((item) => item.indicator !== indicatorName)
    );
  }


  // =========================================================
  // 🗓️ Grouping Functions
  // =========================================================
  function groupByMonth(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const y = item.dateObj.getFullYear();
      const m = item.dateObj.getMonth() + 1;
      const key = `${y}-${m}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => {
        const [y, m] = key.split('-');
        const label = `📅 ${getMonthName(m)} ${y}`;
        return { label, data: items };
      });
  }

  function groupByQuarter(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const y = item.dateObj.getFullYear();
      const q = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${y}-Q${q}`;
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

  function getMonthName(m) {
    const maanden = [
      'Januari','Februari','Maart','April','Mei','Juni',
      'Juli','Augustus','September','Oktober','November','December'
    ];
    return maanden[parseInt(m, 10) - 1] || 'Onbekend';
  }


  // =========================================================
  // EXPORT
  // =========================================================
  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    indicatorNames,
    scoreRules,
    loadScoreRules,
    addTechnicalData,
    handleRemove,
  };
}
