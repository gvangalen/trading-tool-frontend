'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/lib/api/dashboard';

export function useDashboardData() {
  const [macroScore, setMacroScore] = useState(0);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [setupScore, setSetupScore] = useState(0);

  const [macroExplanation, setMacroExplanation] = useState('📡 Data wordt geladen...');
  const [technicalExplanation, setTechnicalExplanation] = useState('📡 Data wordt geladen...');
  const [setupExplanation, setSetupExplanation] = useState('📡 Data wordt geladen...');

  const [technicalTopContributors, setTechnicalTopContributors] = useState([]);
  const [macroTopContributors, setMacroTopContributors] = useState([]);
  const [setupTopContributors, setSetupTopContributors] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        if (!mounted || !data) return;

        // ✅ DIRECTE velden gebruiken — geen nested 'scores' of 'explanation'
        setMacroScore(data?.macro_score ?? 0);
        setTechnicalScore(data?.technical_score ?? 0);
        setSetupScore(data?.setup_score ?? 0);

        setMacroExplanation(data?.macro_interpretation ?? '⚠️ Geen uitleg beschikbaar');
        setTechnicalExplanation(data?.technical_interpretation ?? '⚠️ Geen uitleg beschikbaar');
        setSetupExplanation(data?.setup_interpretation ?? '⚠️ Geen setupinformatie beschikbaar');

        // ✅ Dynamische contributors instellen
        const technicalData = data.technical_data || {};
        const macroData = data.macro_data || [];
        const setups = data.setups || [];

        const techKeys = Object.keys(technicalData).map((k) => k.toUpperCase());
        setTechnicalTopContributors(techKeys.slice(0, 5));

        const macroKeys = macroData.map((item) => item.name);
        setMacroTopContributors(macroKeys.slice(0, 5));

        const setupNames = setups.map((s) => s.name);
        setSetupTopContributors(setupNames.slice(0, 5));

      } catch (err) {
        console.warn('⚠️ Dashboarddata niet geladen. Gebruik fallbackwaarden.');

        setMacroScore(0);
        setTechnicalScore(0);
        setSetupScore(0);

        setMacroExplanation('❌ Kon macrodata niet laden');
        setTechnicalExplanation('❌ Kon technische data niet laden');
        setSetupExplanation('❌ Geen setupinformatie beschikbaar');

        setTechnicalTopContributors([]);
        setMacroTopContributors([]);
        setSetupTopContributors([]);
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
    macroExplanation,
    technicalExplanation,
    setupExplanation,
    technicalTopContributors,
    macroTopContributors,
    setupTopContributors,
    loading,
  };
}
