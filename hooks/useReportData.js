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
 * ✅ Stabiele report hook (JS-versie)
 * - Geen TS syntax
 * - Geen infinite loops
 * - 404 = "nog geen rapport"
 * - 'error' = echte fout
 */
export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | 404 | 'error'

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

  // ==========================
  // 📆 Datums ophalen (1x per reportType)
  // ==========================
  useEffect(() => {
    let cancelled = false;

    async function loadDates() {
      try {
        const data = await current.getDates();
        if (cancelled) return;

        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (a < b ? 1 : -1))
          : [];

        setDates(sorted);
        setSelectedDate('latest');
      } catch {
        setDates([]);
      }
    }

    loadDates();
    return () => {
      cancelled = true;
    };
  }, [reportType]);

  // ==========================
  // 📄 Rapport ophalen
  // ==========================
  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      setError(null);

      try {
        const data =
          selectedDate === 'latest'
            ? await current.getLatest()
            : await current.getByDate(selectedDate);

        if (cancelled) return;

        const isEmpty =
          !data || typeof data !== 'object' || Object.keys(data).length === 0;

        if (isEmpty) {
          setReport(null);
          setError(404); // 👈 normaal: nog geen rapport
        } else {
          setReport(data);
        }
      } catch {
        if (!cancelled) {
          setReport(null);
          setError(404); // backend geeft 404 → frontend rustig
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReport();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, reportType]);

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error, // null | 404 | 'error'
    hasReport: !!report && !loading,
  };
}
