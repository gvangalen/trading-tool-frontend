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


// ------------------------------------------------------
// 🧠 Adviesfunctie (zelfde model als macro & market)
// ------------------------------------------------------
const getAdvies = (score) =>
  score >= 75 ? '🟢 Bullish'
    : score <= 25 ? '🔴 Bearish'
      : '⚖️ Neutraal';


export function useTechnicalData(activeTab = 'Dag') {

  // ➤ Tabelgegevens
  const [technicalData, setTechnicalData] = useState([]);

  // ➤ Meterwaarden
  const [technicalScore, setTechnicalScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  // ➤ Indicatorselectie
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  // ➤ Status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =========================================================
  // INIT
  // =========================================================
  useEffect(() => {
    loadAll();
  }, [activeTab]);


  // =========================================================
  // ALLES LADEN
  // =========================================================
  async function loadAll() {
    setLoading(true);

    try {
      // 1️⃣ tabeldata
      await loadTechnicalTable();

      // 2️⃣ meter (daily_scores)
      await loadTechnicalMeter();

      // 3️⃣ indicatornamen (dropdown)
      const names = await getIndicatorNames();
      setIndicatorNames(names || []);

    } catch (err) {
      console.error('❌ loadAll technical:', err);
      setError('Kon technical data niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // 1️⃣ TABEL LADEN
  // =========================================================
  async function loadTechnicalTable() {

    let raw = [];

    switch (activeTab) {
      case 'Dag':
        raw = await technicalDataDay();
        break;

      case 'Week':
        raw = await technicalDataWeek();
        break;

      case 'Maand':
        raw = await technicalDataMonth();
        break;

      case 'Kwartaal':
        raw = await technicalDataQuarter();
        break;

      default:
        raw = await technicalDataDay();
    }

    if (!Array.isArray(raw)) raw = [];

    const enriched = raw.map((item) => ({
      name: item.indicator ?? item.name ?? '–',
      value: item.waarde ?? item.value ?? '–',
      score: item.score ?? null,
      advies: item.advies ?? null,
      uitleg: item.uitleg ?? null,
      symbol: item.symbol ?? '',
      timestamp: item.timestamp ?? null,
      dateObj: item.timestamp ? new Date(item.timestamp) : null,
    }));

    // Groepering
    if (activeTab === 'Maand') {
      setTechnicalData(groupByMonth(enriched));
    } else if (activeTab === 'Kwartaal') {
      setTechnicalData(groupByQuarter(enriched));
    } else {
      setTechnicalData(enriched);
    }
  }


  // =========================================================
  // 2️⃣ METER (daily_scores)
  // =========================================================
  async function loadTechnicalMeter() {
    const scores = await getDailyScores();

    const s = parseFloat(scores?.technical_score ?? 0);

    setTechnicalScore(s.toFixed(1));
    setAdviesState(getAdvies(s));
  }


  // =========================================================
  // SCORE RULES
  // =========================================================
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ Fout bij technical scorerules:', err);
    }
  }


  // =========================================================
  // ADD TECHNICAL INDICATOR
  // =========================================================
  async function addTechnicalData(name) {
    try {
      await technicalDataAdd(name);
      await loadAll();
    } catch (err) {
      console.error('❌ addTechnicalData error:', err);
    }
  }


  // =========================================================
  // GROEPERING HELPERS
  // =========================================================
  function groupByMonth(data) {
    const grouped = {};

    data.forEach((item) => {
      if (!item.dateObj) return;
      const y = item.dateObj.getFullYear();
      const m = item.dateObj.getMonth() + 1;
      const key = `${y}-${m}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

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

    data.forEach((item) => {
      if (!item.dateObj) return;
      const y = item.dateObj.getFullYear();
      const q = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${y}-Q${q}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

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
    technicalData,

    technicalScore,     // meterwaarde
    advies,             // meter advies

    loading,
    error,

    indicatorNames,
    scoreRules,

    loadScoreRules,
    addTechnicalData,
  };
}
