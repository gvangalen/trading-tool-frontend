'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

export function useReportData() {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 Haal beschikbare datums op bij mount
  useEffect(() => {
    const controller = new AbortController();
    async function loadDates() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/daily_report/history`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server antwoordde met ${res.status}`);
        const data = await res.json();
        setDates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('⚠️ Datums ophalen mislukt:', err);
        setDates([]);
      }
    }
    loadDates();
    return () => controller.abort(); // cleanup
  }, []);

  // 🔁 Haal rapport op bij wijziging van datum
  useEffect(() => {
    const controller = new AbortController();
    async function loadReport(date) {
      setLoading(true);
      setError('');
      try {
        const endpoint =
          date === 'latest'
            ? `${API_BASE_URL}/api/daily_report/latest`
            : `${API_BASE_URL}/api/daily_report/${date}`;
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error(`Server antwoordde met ${res.status}`);
        const data = await res.json();
        setReport(data || null);
      } catch (err) {
        console.error('❌ Rapport laden mislukt:', err);
        setError('Rapport kon niet geladen worden.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate) loadReport(selectedDate);
    return () => controller.abort();
  }, [selectedDate]);

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
  };
}
