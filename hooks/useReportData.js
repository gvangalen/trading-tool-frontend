'use client';

import { useEffect, useState } from 'react';
import {
  fetchReportDates,
  fetchReportLatest,
} from '@/lib/api/report';

/**
 * Hook die rapporten laadt op basis van type ('daily', 'weekly', 'monthly', 'quarterly').
 * Ondersteunt het ophalen van datums, het laatste rapport en fallback naar specifieke datum.
 */
export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 📆 Laad beschikbare datums wanneer reportType verandert
  useEffect(() => {
    const controller = new AbortController();

    async function loadDates() {
      try {
        const data = await fetchReportDates(reportType);
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (a < b ? 1 : -1))
          : [];
        setDates(sorted);
        setSelectedDate('latest');
        console.log(`📅 Beschikbare datums voor ${reportType}:`, sorted);
      } catch (err) {
        console.error(`⚠️ Fout bij ophalen datums (${reportType}):`, err);
        setDates([]);
      }
    }

    loadDates();
    return () => controller.abort();
  }, [reportType]);

  // 📄 Laad rapport bij wijziging van reportType of geselecteerde datum
  useEffect(() => {
    const controller = new AbortController();

    async function loadReport() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchReportLatest(reportType);

        // ✅ Fallback als data null of leeg object is
        const isEmpty = !data || (typeof data === 'object' && Object.keys(data).length === 0);

        if (isEmpty && selectedDate === 'latest' && dates.length > 0) {
          console.warn(`⚠️ Geen rapport voor 'latest'. Fallback naar: ${dates[0]}`);
          setSelectedDate(dates[0]);
          return;
        }

        setReport(data || null);
        console.log(`📄 Rapport geladen (${reportType} / ${selectedDate}):`, data);
      } catch (err) {
        console.error(`❌ Fout bij laden rapport (${reportType}):`, err);
        setError('Rapport kon niet geladen worden.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate === 'latest') {
      loadReport();
    }

    return () => controller.abort();
  }, [selectedDate, reportType, dates]);

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    hasReport: !!report && !loading,
  };
}
