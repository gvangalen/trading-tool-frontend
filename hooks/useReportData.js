'use client';

import { useEffect, useState } from 'react';
import { fetchReportDates, fetchReportByDate } from '@/lib/api/report';

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
        const data = await fetchReportDates();
        setDates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('⚠️ Datums ophalen mislukt:', err);
        setDates([]);
      }
    }
    loadDates();
    return () => controller.abort();
  }, []);

  // 🔁 Haal rapport op bij wijziging van datum
  useEffect(() => {
    const controller = new AbortController();
    async function loadReport(date) {
      setLoading(true);
      setError('');
      try {
        const data = await fetchReportByDate(date);
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
