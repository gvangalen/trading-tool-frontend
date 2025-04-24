// ✅ useReportData.js — vervangt report.js
'tuse client';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

export function useReportData() {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);

  // 🔁 Laad beschikbare datums voor dropdown
  useEffect(() => {
    fetch(`${API_BASE_URL}/daily_report/history`)
      .then(res => res.json())
      .then(setDates)
      .catch(err => console.warn('⚠️ Kon geen datums laden:', err));
  }, []);

  // 📡 Laad rapport bij verandering van datum
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      const endpoint = selectedDate === 'latest'
        ? `${API_BASE_URL}/daily_report/latest`
        : `${API_BASE_URL}/daily_report/${selectedDate}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error('❌ Fout bij ophalen rapport:', err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedDate]);

  return { report, dates, selectedDate, setSelectedDate, loading };
}
