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

/* ============================================================
   ✅ HOOFD-HOOK (volledige refresh + normalisatie)
============================================================ */
export function useMacroData(activeTab = 'Dag') {

  const [macroData, setMacroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  /* ------------------------------------------------------------
     🎯 1. Load indicator lijst
  ------------------------------------------------------------ */
  useEffect(() => {
    getMacroIndicatorNames()
      .then((list) => setIndicatorNames(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  /* ------------------------------------------------------------
     🎯 2. Load macro data per tab (dag/week/maand/kwartaal)
  ------------------------------------------------------------ */
  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let raw;

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

      if (!Array.isArray(raw)) throw new Error('Macrodata is geen array');

      /* ------------------------------------------------------------
         🔁 Normalisatie zodat front-end tabel ALTIJD consistente keys heeft
      ------------------------------------------------------------ */
      const normalized = raw.map((item) => ({
        name: item.name || item.indicator || '–',
        value: item.value ?? item.waarde ?? null,
        score: item.score ?? null,
        trend: item.trend ?? null,
        interpretation: item.interpretation ?? item.uitleg ?? null,
        advice: item.advice ?? item.advies ?? null,
        timestamp: item.timestamp ?? null,
      }));

      setMacroData(normalized);

    } catch (err) {
      console.error('❌ Macro data load error:', err);
      setMacroData([]);
      setError('Fout bij laden van macrodata');
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------
     🧠 3. Load scoreregels (voor ScoreView)
  ------------------------------------------------------------ */
  async function loadScoreRules(indicatorName) {
    if (!indicatorName) return;

    try {
      const rules = await getScoreRulesForMacroIndicator(indicatorName);
      setScoreRules(Array.isArray(rules) ? rules : []);
    } catch (err) {
      console.error('❌ Score rules error:', err);
    }
  }

  /* ------------------------------------------------------------
     ➕ 4. Indicator toevoegen (fixed refresh)
  ------------------------------------------------------------ */
  async function addMacroIndicator(indicatorName) {
    if (!indicatorName) return;

    try {
      await macroDataAdd(indicatorName);

      // ⭐ Direct updaten → realtime UI
      await loadData();

    } catch (err) {
      console.error('❌ Toevoegen macro indicator mislukt:', err);
    }
  }

  /* ------------------------------------------------------------
     🗑️ 5. Indicator verwijderen (optimistische update)
  ------------------------------------------------------------ */
  async function removeMacroIndicator(name) {
    if (!name || name === '–') return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je '${name}' wilt verwijderen?`
    );
    if (!confirmDelete) return;

    try {
      await deleteMacroIndicator(name);

      // Optimistische update → direct uit UI
      setMacroData((prev) => prev.filter((item) => item.name !== name));

      // Eventueel: await loadData();
    } catch (err) {
      alert('❌ Verwijderen mislukt.');
      console.error(err);
    }
  }

  /* ------------------------------------------------------------
     🔄 RETURN OBJECT
  ------------------------------------------------------------ */
  return {
    macroData,
    loading,
    error,

    indicatorNames,
    scoreRules,
    loadScoreRules,

    addMacroIndicator,
    removeMacroIndicator,
    reload: loadData, // optional extra helper
  };
}
