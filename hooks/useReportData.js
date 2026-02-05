'use client';

import { useEffect, useState, useRef } from 'react';
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
 * ✅ Robuuste report hook
 * - 404 ≠ error tijdens generatie
 * - polling tijdens Celery run
 * - geen infinite loops
 */
export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | 404 | 'timeout'

  const isGeneratingRef = useRef(false);
  const pollAttemptsRef = useRef(0);

  const POLL_INTERVAL = 5000; // 5s
  const MAX_POLLS = 36; // 3 minuten

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

  // =====================================================
  // 📆 Datums laden
  // =====================================================
  useEffect(() => {
    let cancelled = false;

    async function loadDates() {
      try {
        const data = await current.getDates();
        if (cancelled) return;

        setDates(
          Array.isArray(data)
            ? data.sort((a, b) => (a < b ? 1 : -1))
            : []
        );
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

  // =====================================================
  // 📄 Rapport laden + polling
  // =====================================================
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

        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          // ✅ REPORT BESTAAT
          setReport(data);
          isGeneratingRef.current = false;
          pollAttemptsRef.current = 0;
          setLoading(false);
          return;
        }

        throw new Error('empty');
      } catch {
        if (cancelled) return;

        // 🔁 Tijdens generatie: blijven pollen
        if (isGeneratingRef.current) {
          pollAttemptsRef.current += 1;

          if (pollAttemptsRef.current >= MAX_POLLS) {
            setError('timeout');
            setLoading(false);
            isGeneratingRef.current = false;
            return;
          }

          setTimeout(loadReport, POLL_INTERVAL);
          return;
        }

        // 🧘 Normale 404 → geen rapport
        setReport(null);
        setError(404);
        setLoading(false);
      }
    }

    loadReport();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, reportType]);

  // =====================================================
  // 🚀 Exposed helper voor UI
  // =====================================================
  const startGenerating = () => {
    isGeneratingRef.current = true;
    pollAttemptsRef.current = 0;
    setLoading(true);
    setError(null);
  };

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error, // null | 404 | 'timeout'
    hasReport: !!report && !loading,
    startGenerating, // 👈 AANROEPEN bij "Genereer rapport"
  };
}
