'use client';

import { useEffect, useState } from 'react';
import {
  fetchDailyReportLatest,
  fetchDailyReportByDate,
  fetchDailyReportDates,
  fetchWeeklyReportLatest,
  fetchWeeklyReportByDate,
  fetchWeeklyReportDates,
  fetchMonthlyReportLatest,
  fetchMonthlyReportByDate,
  fetchMonthlyReportDates,
  fetchQuarterlyReportLatest,
  fetchQuarterlyReportByDate,
  fetchQuarterlyReportDates,
} from '@/lib/api/report';

/**
 * ✅ Deze hook ondersteunt nu alle rapporttypes met gesplitste API-calls:
 * - 'daily'
 * - 'weekly'
 * - 'monthly'
 * - 'quarterly'
 */
export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔁 Helper-functies per rapporttype
  const fetchFunctions = {
    daily: {
      getDates: fetchDailyReportDates,
      getLatest: fetchDailyReportLatest,
      getByDate: fetchDailyReportByDate,
    },
    weekly: {
      getDates: fetchWeeklyReportDates,
      getLatest: fetchWeeklyReportLatest,
      getByDate: fetchWeeklyReportByDate,
    },
    monthly: {
      getDates: fetchMonthlyReportDates,
      getLatest: fetchMonthlyReportLatest,
      getByDate: fetchMonthlyReportByDate,
    },
    quarterly: {
      getDates: fetchQuarterlyReportDates,
      getLatest: fetchQuarterlyReportLatest,
      getByDate: fetchQuarterlyReportByDate,
    },
  };

  const current = fetchFunctions[reportType];

  // 📆 Laad datums
  useEffect(() => {
    const controller = new AbortController();

    async function loadDates() {
      try {
        const data = await current.getDates();
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (a < b ? 1 : -1)) // nieuwste eerst
          : [];
        setDates(sorted);
        setSelectedDate('latest');
        console.log(`📅 Datums voor ${reportType}:`, sorted);
      } catch (err) {
        console.error(`⚠️ Fout bij ophalen datums (${reportType}):`, err);
        setDates([]);
      }
    }

    loadDates();
    return () => controller.abort();
  }, [reportType]);

  // 📄 Laad rapport
  useEffect(() => {
    const controller = new AbortController();

    async function loadReport() {
      setLoading(true);
      setError('');

      try {
        let data = null;
        if (selectedDate === 'latest') {
          data = await current.getLatest();
        } else {
          data = await current.getByDate(selectedDate);
        }

        const isEmpty = !data || Object.keys(data).length === 0;

        if (isEmpty && selectedDate === 'latest' && dates.length > 0) {
          const fallbackDate = dates[0];
          console.warn(`⚠️ Geen latest. Fallback naar ${fallbackDate}`);
          setSelectedDate(fallbackDate);
          return;
        }

        setReport(isEmpty ? null : data);
      } catch (err) {
        console.error(`❌ Fout bij ophalen rapport (${reportType}):`, err);
        setError('Rapport kon niet geladen worden.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
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
