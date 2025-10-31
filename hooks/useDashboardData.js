'use client';

import { useEffect, useState } from 'react';
import { fetchDailyScores } from '@/lib/api/scores'; // 👈 deze moet je aanmaken als je 'fetchDashboardData' niet wil aanpassen

export function useDashboardData() {
  const [macroScore, setMacroScore] = useState(0);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [setupScore, setSetupScore] = useState(0);
  const [marketScore, setMarketScore] = useState(0);

  const [macroExplanation, setMacroExplanation] = useState('📡 Data wordt geladen...');
  const [technicalExplanation, setTechnicalExplanation] = useState('📡 Data wordt geladen...');
  const [setupExplanation, setSetupExplanation] = useState('📡 Data wordt geladen...');
  const [marketExplanation, setMarketExplanation] = useState('📡 Data wordt geladen...');

  const [macroTop, setMacroTop] = useState([]);
  const [technicalTop, setTechnicalTop] = useState([]);
  const [setupTop, setSetupTop] = useState([]);
  const [marketTop, setMarketTop] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchDailyScores(); // 🔁 haalt direct /api/scores/daily op
        if (!mounted || !res) return;

        setMacroScore(res.macro?.score ?? 0);
        setMacroExplanation(res.macro?.interpretation ?? '–');
        setMacroTop(res.macro?.top_contributors ?? []);

        setTechnicalScore(res.technical?.score ?? 0);
        setTechnicalExplanation(res.technical?.interpretation ?? '–');
        setTechnicalTop(res.technical?.top_contributors ?? []);

        setSetupScore(res.setup?.score ?? 0);
        setSetupExplanation(res.setup?.interpretation ?? '–');
        setSetupTop(res.setup?.top_contributors ?? []);

        setMarketScore(res.market?.score ?? 0);
        setMarketExplanation(res.market?.interpretation ?? '–');
        setMarketTop(res.market?.top_contributors ?? []);

      } catch (err) {
        console.error('❌ Fout bij ophalen scores:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    macroScore,
    technicalScore,
    setupScore,
    marketScore,
    macroExplanation,
    technicalExplanation,
    setupExplanation,
    marketExplanation,
    macroTop,
    technicalTop,
    setupTop,
    marketTop,
    loading,
  };
}
