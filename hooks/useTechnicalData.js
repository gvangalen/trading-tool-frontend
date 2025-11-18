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

  // dropdown
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  useEffect(() => {
    loadData();
    loadIndicatorNames();
  }, [activeTab]);

  // ======================================================
  // LADEN VAN DATA
  // ======================================================
  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let raw;

      // juiste backend-calls
      if (activeTab === 'Dag') raw = await technicalDataDay();
      else if (activeTab === 'Week') raw = await technicalDataWeek();
      else if (activeTab === 'Maand') raw = await technicalDataMonth();
      else if (activeTab === 'Kwartaal') raw = await technicalDataQuarter();

      if (!Array.isArray(raw)) throw new Error('Technische data is geen lijst');

      // BACKEND-STANDAARD (jouw backend stuurt ALTIJD dezelfde vorm)
      const enriched = raw.map((item) => ({
        indicator: item.indicator || '–',
        waarde: item.waarde ?? '–',
        score: item.score ?? null,
        advies: item.advies ?? null,
        uitleg: item.uitleg ?? null,
        timestamp: item.timestamp ?? null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      // GROEPEREN VOLGENS TAB
      if (activeTab === 'Week') setTechnicalData(groupByDay(enriched));
      else if (activeTab === 'Maand') setTechnicalData(groupByMonth(enriched));
      else if (activeTab === 'Kwartaal') setTechnicalData(groupByQuarter(enriched));
      else setTechnicalData(enriched);

      // Score ophalen
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
      console.error('⚠️ Technische data kon niet worden geladen:', err);
      setTechnicalData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van technische data');
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // DROPDOWN: ALLE TECHNISCHE INDICATOREN
  // ======================================================
  async function loadIndicatorNames() {
    try {
      const list = await getIndicatorNames();
      setIndicatorNames(list);
    } catch (err) {
      console.error('❌ Fout bij ophalen indicator names:', err);
    }
  }

  // ======================================================
  // SCORE RULES
  // ======================================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error('❌ Fout bij rules ophalen:', err);
    }
  }

  // ======================================================
  // TOEVOEGEN VAN EEN TECHNISCHE INDICATOR
  // ======================================================
  async function addTechnicalIndicator(indicatorName) {
    try {
      const result = await technicalDataAdd(indicatorName);
      await loadData();
      return result;
    } catch (err) {
      console.error('❌ addTechnicalIndicator mislukt:', err);
      throw err;
    }
  }

  // ======================================================
  // VERWIJDEREN VAN EEN INDICATOR
  // ======================================================
  async function removeTechnicalIndicator(indicatorName) {
    try {
      await deleteTechnicalIndicator(indicatorName);
      await loadData();
    } catch (err) {
      console.error('❌ Verwijderen technical mislukt:', err);
    }
  }

  // ======================================================
  // GEMIDDELDE SCORE
  // ======================================================
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
      avg >= 70 ? '🟢 Bullish'
      : avg <= 40 ? '🔴 Bearish'
      : '⚖️ Neutraal'
    );
  }

  // ======================================================
  // GROEPERING HELPERS
  // ======================================================
  function groupByDay(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const date = item.dateObj.toISOString().slice(0, 10);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
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
      const y = item.dateObj.getFullYear();
      const m = item.dateObj.getMonth() + 1;
      const key = `${y}-${m}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }
    return Object.entries(grouped).map(([key, items]) => ({
      label: `📅 ${key}`,
      data: items,
    }));
  }

  function groupByQuarter(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getFullYear();
      const q = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${year}-Q${q}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }
    return Object.entries(grouped).map(([key, items]) => ({
      label: `📊 ${key}`,
      data: items,
    }));
  }

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
