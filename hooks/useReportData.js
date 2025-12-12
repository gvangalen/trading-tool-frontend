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
 * ✅ Volledig stabiele report hook
 * - Geeft 404 correct door
 * - Maakt onderscheid tussen "geen rapport" en "echte fout"
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
  // 📆 Datums ophalen
  // ==========================
  useEffect(() => {
    async function loadDates() {
      try {
        const data = await current.getDates();
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (a < b ? 1 : -1))
          : [];
        setDates(sorted);
        setSelectedDate('latest');
      } catch (err) {
        console.warn(`⚠️ Geen datums (${reportType})`, err);
        setDates([]);
      }
    }

    loadDates();
  }, [reportType, current]);

  // ==========================
  // 📄 Rapport ophalen
  // ==========================
  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (selectedDate === 'latest') {
          data = await current.getLatest();
        } else {
          data = await current.getByDate(selectedDate);
        }

        const isEmpty =
          !data || typeof data !== 'object' || Object.keys(data).length === 0;

        if (isEmpty) {
          setReport(null);
          setError(404); // ✅ expliciet: geen rapport
          return;
        }

        setReport(data);
      } catch (err) {
        const status =
          err?.status ||
          err?.response?.status ||
          (typeof err === 'number' ? err : null);

        if (status === 404) {
          // ✅ NORMAAL: nog geen rapport
          setReport(null);
          setError(404);
        } else {
          console.error(`❌ Report error (${reportType})`, err);
          setReport(null);
          setError('error');
        }
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [selectedDate, reportType, current]);

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
