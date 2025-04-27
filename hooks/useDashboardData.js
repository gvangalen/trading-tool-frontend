// ✅ hooks/useDashboardData.js
'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/lib/api/dashboard'; // 🚀 Nieuwe juiste locatie!

export function useDashboardData() {
  const [marketData, setMarketData] = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await fetchDashboardData();

        if (mounted && data) {
          setMarketData(data.crypto || {});
          setMacroData({
            fear_greed_index: data.fear_greed_index ?? 'N/A',
            dominance: data.crypto?.bitcoin?.dominance?.toFixed(2) ?? 'N/A',
          });
        }
      } catch (error) {
        console.error('❌ Fout bij laden dashboarddata:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000); // 🔁 Elke 60 sec verversen

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { marketData, macroData, loading };
}
