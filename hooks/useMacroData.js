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

/* ============================================================
   ✅ HOOFD-HOOK
============================================================ */
export function useMacroData(activeTab = 'Dag') {

  const [macroData, setMacroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  /* ------------------------------------------------------------
     🎯 1. LOAD INDICATOR LIST
  ------------------------------------------------------------ */
  useEffect(() => {
    getMacroIndicatorNames()
      .then((list) => setIndicatorNames(list || []))
      .catch(() => {});
  }, []);

  /* ------------------------------------------------------------
     🎯 2. LOAD MACRO DATA PER TAB
  ------------------------------------------------------------ */
  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let raw;

      if (activeTab === 'Dag')       raw = await fetchMacroDataByDay();
      else if (activeTab === 'Week') raw = await fetchMacroDataByWeek();
      else if (activeTab === 'Maand') raw = await fetchMacroDataByMonth();
      else if (activeTab === 'Kwartaal') raw = await fetchMacroDataByQuarter();
      else raw = await fetchMacroDataByDay();

      if (!Array.isArray(raw)) throw new Error('Macrodata is geen array');

      /* ------------------------------------------------------------
         🔥 BELANGRIJKSTE FIX — normalize data
         Zodat DayTable WÉL een naam heeft om op te deleten
      ------------------------------------------------------------ */
      const normalized = raw.map((item) => ({
        name: item.name || item.indicator || '–',   // ← DELETE BASED ON THIS
        value: item.value ?? item.waarde ?? '–',
        score: item.score ?? null,
        advice: item.advice ?? item.advies ?? null,
        interpretation: item.interpretation ?? item.uitleg ?? null,
        trend: item.trend ?? null,
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
     🧠 3. Load scoreregels voor ScoreView
  ------------------------------------------------------------ */
  async function loadScoreRules(indicatorName) {
    if (!indicatorName) return;

    try {
      const rules = await getScoreRulesForMacroIndicator(indicatorName);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ Score rules error:', err);
    }
  }

  /* ------------------------------------------------------------
     ➕ 4. Indicator toevoegen
  ------------------------------------------------------------ */
  async function addMacroIndicator(indicatorName) {
    if (!indicatorName) return;

    try {
      await macroDataAdd(indicatorName);
      await loadData(); // refresh
    } catch (err) {
      console.error('❌ Toevoegen macro indicator mislukt:', err);
    }
  }

  /* ------------------------------------------------------------
     🗑️ 5. Indicator verwijderen  (FIXED!)
  ------------------------------------------------------------ */
  async function removeMacroIndicator(name) {
    if (!name || name === '–') return;

    const confirmDelete = window.confirm(
      `Weet je zeker dat je '${name}' wilt verwijderen?`
    );

    if (!confirmDelete) return;

    try {
      await deleteMacroIndicator(name);

      // Optimistische UI update
      setMacroData((prev) => prev.filter((item) => item.name !== name));

      // Herladen is optional maar kan
      // await loadData();
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
  };
}
