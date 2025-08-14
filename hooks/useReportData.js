'use client';

import { useEffect, useState } from 'react';
import { fetchReportDates, fetchReportByDate } from '@/lib/api/report';

export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 📆 Haal beschikbare datums op bij mount of wijziging reportType
  useEffect(() => {
    const controller = new AbortController();

    async function loadDates() {
      try {
        const data = await fetchReportDates(reportType);
        const sortedDates = Array.isArray(data)
          ? data.sort((a, b) => (a < b ? 1 : -1)) // ✅ Nieuwste eerst
          : [];
        setDates(sortedDates);
        console.log(`📅 Beschikbare datums (${reportType}):`, sortedDates);
      } catch (err) {
        console.error(`⚠️ Datums ophalen mislukt (${reportType}):`, err);
        setDates([]);
      }
    }

    loadDates();
    return () => controller.abort();
  }, [reportType]);

  // 📄 Haal rapport op bij wijziging van datum of reportType
  useEffect(() => {
    const controller = new AbortController();

    async function loadReport(date) {
      setLoading(true);
      setError('');
      try {
        const data = await fetchReportByDate(reportType, date);

        if (!data && date === 'latest' && dates.length > 0) {
          console.warn(`⚠️ Geen data bij 'latest', probeer fallback: ${dates[0]}`);
          setSelectedDate(dates[0]); // ✅ Probeer meest recente echte datum
          return; // wacht op nieuwe render
        }

        setReport(data || null);
        console.log(`📄 Rapport geladen (${reportType} / ${date}):`, data);
      } catch (err) {
        console.error(`❌ Rapport laden mislukt (${reportType}):`, err);
        setError('Rapport kon niet geladen worden.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate) loadReport(selectedDate);
    return () => controller.abort();
  }, [selectedDate, reportType, dates]);

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
  };
}
