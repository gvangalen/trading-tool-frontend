'use client';
import { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/lib/api/dashboard';

export function useDashboardData() {
  const [marketData, setMarketData] = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      if (mounted && data) {
        setMarketData(data.crypto || {});
        setMacroData({
          fear_greed_index: data.fear_greed_index ?? 'N/A',
          dominance: data.crypto?.bitcoin?.dominance?.toFixed(2) ?? 'N/A'
        });
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { marketData, macroData, loading };
}
