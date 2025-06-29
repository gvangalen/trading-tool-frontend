'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

export function useReportData() {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 Haal beschikbare datums op (één keer bij mount)
  useEffect(() => {
    const controller = new AbortController();
    async function loadDates() {
      try {
        const res = await fetch(`${API_BASE_URL}/daily_report/history`, {
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
            ? `${API_BASE_URL}/daily_report/latest`
            : `${API_BASE_URL}/daily_report/${date}`;
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
    return () => controller.abort(); // cleanup
  }, [selectedDate]);

  // 📥 Download PDF als fallback (bijv. voor printen of archiveren)
  function downloadReport() {
    if (!report) return;
    const content = document.getElementById('dailyReportContent');
    if (!content) return;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Trading Report - ${report.report_date}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h2 { margin-bottom: 1rem; }
              table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background: #f0f0f0; }
            </style>
          </head>
          <body>${content.innerHTML}</body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  }

  return {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    downloadReport,
  };
}
