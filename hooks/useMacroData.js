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

import { useModal } from "@/components/modal/ModalProvider";

/* ============================================================
   ⭐ OFFICIËLE MACRO HOOK — DUPLICATE-SAFE (Market parity)
============================================================ */
export function useMacroData(activeTab = 'Dag') {

  /* ------------------------------------------------------------
     STATE
  ------------------------------------------------------------ */
  const [macroData, setMacroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  const { showSnackbar, openConfirm } = useModal();

  /* ------------------------------------------------------------
     🔑 AFGELEIDE HELPERS (BELANGRIJK)
  ------------------------------------------------------------ */
  const activeMacroIndicatorNames = macroData.map(m => m.name);

  /* ------------------------------------------------------------
     📌 1. Indicatornamen laden (globaal)
  ------------------------------------------------------------ */
  useEffect(() => {
    async function loadIndicators() {
      try {
        const list = await getMacroIndicatorNames();
        setIndicatorNames(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('❌ Fout bij ophalen macro indicatornamen:', err);
      }
    }
    loadIndicators();
  }, []);

  /* ------------------------------------------------------------
     📌 2. Macrodata laden per tab
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
        case 'Dag':      raw = await fetchMacroDataByDay(); break;
        case 'Week':     raw = await fetchMacroDataByWeek(); break;
        case 'Maand':    raw = await fetchMacroDataByMonth(); break;
        case 'Kwartaal': raw = await fetchMacroDataByQuarter(); break;
        default:         raw = await fetchMacroDataByDay();
      }

      if (!Array.isArray(raw)) throw new Error('Macrodata is geen array');

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
      console.error('❌ Macrodata load error:', err);
      setMacroData([]);
      setError('Fout bij laden van macrodata');
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------
     📌 3. Scoreregels ophalen (ScoreView)
  ------------------------------------------------------------ */
  async function loadScoreRules(indicator) {
    if (!indicator) return;

    try {
      const rules = await getScoreRulesForMacroIndicator(indicator);
      setScoreRules(Array.isArray(rules) ? rules : []);
    } catch (err) {
      console.error('❌ Fout bij macro scoreregels:', err);
    }
  }

  /* ------------------------------------------------------------
     ➕ 4. Macro-indicator toevoegen (DUPLICATE SAFE)
  ------------------------------------------------------------ */
  async function addMacroIndicator(name) {
    if (!name) return;

    // 🔒 FRONTEND DUPLICATE GUARD
    if (activeMacroIndicatorNames.includes(name)) {
      showSnackbar(`'${name}' is al toegevoegd`, 'info');
      return;
    }

    try {
      await macroDataAdd(name);
      await loadData();

      showSnackbar(`Macro-indicator '${name}' toegevoegd ✔️`, 'success');

    } catch (err) {
      console.error('❌ Fout bij toevoegen macro-indicator:', err);

      // optioneel backend 409 support
      if (err?.response?.status === 409) {
        showSnackbar(`'${name}' is al toegevoegd`, 'info');
        return;
      }

      showSnackbar(`Toevoegen mislukt voor '${name}'`, 'danger');
    }
  }

  /* ------------------------------------------------------------
     🗑️ 5. Verwijderen via Modal (consistent met Market)
  ------------------------------------------------------------ */
  function removeMacroIndicator(name) {
    if (!name || name === '–') return;

    openConfirm({
      title: 'Macro-indicator verwijderen',
      description: `Weet je zeker dat je '${name}' wilt verwijderen?`,
      tone: 'danger',
      confirmText: 'Verwijderen',
      cancelText: 'Annuleren',
      onConfirm: async () => {
        try {
          await deleteMacroIndicator(name);

          setMacroData(prev => prev.filter(m => m.name !== name));
          showSnackbar(`'${name}' verwijderd ✔️`, 'success');

        } catch (err) {
          console.error('❌ Fout bij verwijderen macro-indicator:', err);
          showSnackbar(`Verwijderen mislukt voor '${name}'`, 'danger');
        }
      },
    });
  }

  /* ------------------------------------------------------------
     🔄 EXPORT
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

    activeMacroIndicatorNames, // 👈 ESSENTIEEL VOOR UI (disabled knop)
    reload: loadData,
  };
}
