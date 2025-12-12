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
 * ✅ Stabiele report hook
 * - Geen infinite loops
 * - 404 = geldige "nog geen rapport" status
 * - Scheidt "geen data" van "echte fout"
 */
export function useReportData(reportType = 'daily') {
  const [report, setReport] = useState<any | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('latest');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | 404 | 'error'>(null);

  /**
   * 🔑 Belangrijk:
   * - null  = nog niet bepaald
   * - false = er zijn GEEN rapporten → STOP met fetchen
   * - true  = er zijn rapporten → normaal gedrag
   */
  const [hasAnyReports, setHasAnyReports] = useState<boolean | null>(null);

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

  /* =====================================================
     📆 1️⃣ Datums ophalen (BEPALEND)
  ===================================================== */
  useEffect(() => {
    let cancelled = false;

    async function loadDates() {
      setLoading(true);
      setError(null);

      try {
        const data = await current.getDates();

        if (!Array.isArray(data) || data.length === 0) {
          if (!cancelled) {
            setDates([]);
            setHasAnyReports(false); // 🔥 STOP-SIGNAAL
            setLoading(false);
          }
          return;
        }

        const sorted = data.sort((a, b) => (a < b ? 1 : -1));

        if (!cancelled) {
          setDates(sorted);
          setSelectedDate('latest');
          setHasAnyReports(true);
        }
      } catch (err) {
        // 🔥 404 of geen data = normale toestand
        if (!cancelled) {
          setDates([]);
          setHasAnyReports(false);
          setError(404);
          setLoading(false);
        }
      }
    }

    loadDates();

    return () => {
      cancelled = true;
    };
  }, [reportType]);

  /* =====================================================
     📄 2️⃣ Rapport ophalen
     👉 WORDT OVERGESLAGEN als er geen rapporten zijn
  ===================================================== */
  useEffect(() => {
    let cancelled = false;

    // ⛔ Nog niet bekend of er rapporten zijn
    if (hasAnyReports === null) return;

    // ⛔ Er zijn GEEN rapporten → STOP
    if (hasAnyReports === false) {
      setReport(null);
      setError(404);
      setLoading(false);
      return;
    }

    async function loadReport() {
      setLoading(true);
      setError(null);

      try {
        const data =
          selectedDate === 'latest'
            ? await current.getLatest()
            : await current.getByDate(selectedDate);

        if (
          !data ||
          typeof data !== 'object' ||
          Object.keys(data).length === 0
        ) {
          if (!cancelled) {
            setReport(null);
            setError(404);
          }
          return;
        }

        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        if (!cancelled) {
          setReport(null);
          setError(404);
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
  }, [selectedDate, reportType, hasAnyReports]);

  /* =====================================================
     ✅ API
  ===================================================== */
  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error, // null | 404 | 'error'
    hasReport: !!report && !loading,
    hasAnyReports,
  };
}
