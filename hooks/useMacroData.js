'use client';

import { useEffect, useState } from 'react';

import {
  fetchMacroDataByDay,
  fetchMacroDataByWeek,
  fetchMacroDataByMonth,
  fetchMacroDataByQuarter,

  getMacroIndicatorNames,
  getScoreRulesForMacroIndicator,

  macroDataAdd,
  deleteMacroIndicator,
} from '@/lib/api/macro';

import { getDailyScores } from '@/lib/api/scores';

// ------------------------------------------------------
// 🧠 Adviesfunctie (zelfde als market/technical)
// ------------------------------------------------------
const getAdvies = (score) =>
  score >= 75 ? '🟢 Bullish'
    : score <= 25 ? '🔴 Bearish'
      : '⚖️ Neutraal';


export function useMacroData(activeTab = 'Dag') {

  // ➤ Macro-tabel
  const [macroData, setMacroData] = useState([]);

  // ➤ Meter waarden
  const [macroScore, setMacroScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  // ➤ Indicator selectors
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  // ➤ Loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =========================================================
  // INIT
  // =========================================================
  useEffect(() => {
    loadAll();
  }, [activeTab]);


  // =========================================================
  // ALLES LADEN (TABELLEN + METER)
  // =========================================================
  async function loadAll() {
    setLoading(true);

    try {
      // 1️⃣ TABELLEN LADEN
      await loadMacroTable();

      // 2️⃣ METER DIRECT LADEN (ALTJD VIA daily_scores)
      await loadMacroMeter();

      // 3️⃣ Indicatoren voor selectbox
      const names = await getMacroIndicatorNames();
      setIndicatorNames(names || []);

    } catch (err) {
      console.error('❌ loadAll macro:', err);
      setError('Kon macrodata niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // 1️⃣ TABELLEN LADEN
  // =========================================================
  async function loadMacroTable() {

    let raw = [];

    switch (activeTab) {
      case 'Dag':
        raw = await fetchMacroDataByDay();
        break;

      case 'Week':
        raw = await fetchMacroDataByWeek();
        break;

      case 'Maand':
        raw = await fetchMacroDataByMonth();
        break;

      case 'Kwartaal':
        raw = await fetchMacroDataByQuarter();
        break;

      default:
        raw = await fetchMacroDataByDay();
    }

    if (!Array.isArray(raw)) raw = [];

    // Normaliseren
    const enriched = raw.map((item) => ({
      name: item.name ?? item.indicator,
      value: item.value ?? '–',
      score: item.score ?? null,
      trend: item.trend ?? null,
      interpretation: item.interpretation ?? null,
      action: item.action ?? null,
      timestamp: item.timestamp ?? null,
      dateObj: item.timestamp ? new Date(item.timestamp) : null,
    }));

    // Groeperingen
    switch (activeTab) {
      case 'Week':
        setMacroData(groupByWeek(enriched));
        break;

      case 'Maand':
        setMacroData(groupByMonth(enriched));
        break;

      case 'Kwartaal':
        setMacroData(groupByQuarter(enriched));
        break;

      default:
        setMacroData(enriched);
    }
  }


  // =========================================================
  // 2️⃣ METER (ALLEEN DAILY_SCORES)
  // =========================================================
  async function loadMacroMeter() {

    const scores = await getDailyScores();

    const s = parseFloat(scores?.macro_score ?? 0);

    setMacroScore(s.toFixed(1));
    setAdviesState(getAdvies(s));
  }


  // =========================================================
  // SCORE RULES
  // =========================================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForMacroIndicator(indicatorName);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ Fout bij score rules:', err);
    }
  }


  // =========================================================
  // ADD / REMOVE
  // =========================================================
  async function addMacroIndicator(name) {
    try {
      await macroDataAdd(name);
      await loadAll();
    } catch (err) {
      console.error('❌ addMacroIndicator:', err);
    }
  }

  async function removeMacroIndicator(name) {
    try {
      await deleteMacroIndicator(name);
      await loadAll();
    } catch (err) {
      console.error('❌ removeMacroIndicator:', err);
    }
  }


  // =========================================================
  // HELPERS: GROEPERING
  // =========================================================
  function groupByWeek(data) {
    const grouped = {};

    for (const item of data) {
      if (!item.dateObj) continue;

      const d = item.dateObj;
      const week = getISOWeek(d);
      const key = `${d.getUTCFullYear()}-W${week}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped).map(([label, items]) => ({
      label: `📅 ${label}`,
      data: items,
    }));
  }

  function getISOWeek(date) {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
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

    return Object.entries(grouped).map(([key, items]) => {
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

      const y = item.dateObj.getFullYear();
      const q = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${y}-Q${q}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped).map(([key, items]) => ({
      label: `📊 Kwartaal ${key.split('-Q')[1]} – ${key.split('-Q')[0]}`,
      data: items,
    }));
  }

  function getMonthName(m) {
    const arr = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
    ];
    return arr[parseInt(m) - 1] || '';
  }


  // =========================================================
  // EXPORT
  // =========================================================
  return {
    macroData,

    macroScore,
    advies,

    loading,
    error,

    indicatorNames,
    scoreRules,

    loadScoreRules,
    addMacroIndicator,
    removeMacroIndicator,
  };
}
