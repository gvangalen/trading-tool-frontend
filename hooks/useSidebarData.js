'use client';

import { useEffect, useState } from 'react';
import {
  fetchDailyReportSummary,
  fetchActiveTrades,
  fetchAIBotStatus,
} from '@/lib/api/sidebar';

export function useSidebarData() {
  const [summary, setSummary] = useState('');
  const [trades, setTrades] = useState([]);
  const [aiStatus, setAiStatus] = useState({ state: '', strategy: '', updated: '' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadSidebarData() {
      try {
        setLoading(true);
        const [summaryRes, tradesRes, aiRes] = await Promise.all([
          fetchDailyReportSummary(),
          fetchActiveTrades(),
          fetchAIBotStatus(),
        ]);

        if (!isMounted) return;
        setSummary(summaryRes.summary || 'Geen samenvatting beschikbaar');
        setTrades(tradesRes);
        setAiStatus(aiRes);
      } catch (err) {
        console.error('⚠️ Sidebar data ophalen mislukt:', err);
        if (isMounted) setError('Kan sidebar-data niet laden.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSidebarData();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    summary,
    trades,
    aiStatus,
    loading,
    error,
  };
}
