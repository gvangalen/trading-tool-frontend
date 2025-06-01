// ✅ hooks/useDashboardData.js
'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/lib/api/dashboard'; // Zorg dat dit goed werkt

export function useDashboardData() {
  const [macroScore, setMacroScore] = useState(0);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [setupScore, setSetupScore] = useState(0);
  const [macroExplanation, setMacroExplanation] = useState('');
  const [technicalExplanation, setTechnicalExplanation] = useState('');
  const [setupExplanation, setSetupExplanation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchDashboardData();

        if (!mounted || !data) return;

        // ✅ Verwachte structuur vanuit backend:
        setMacroScore(data.scores?.macro ?? 0);
        setTechnicalScore(data.scores?.technical ?? 0);
        setSetupScore(data.scores?.setup ?? 0);

        setMacroExplanation(data.explanation?.macro ?? '');
        setTechnicalExplanation(data.explanation?.technical ?? '');
        setSetupExplanation(data.explanation?.setup ?? '');
      } catch (err) {
        console.error('❌ Fout bij laden dashboarddata:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 60000); // 🔁 elke 60 sec

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
    loading,
  };
}
