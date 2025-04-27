'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

export function useReportData() {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/daily_report/history`)
      .then(res => res.json())
      .then(setDates)
      .catch(err => console.warn('⚠️ Could not load dates:', err));
  }, []);

  useEffect(() => {
    loadReport(selectedDate);
  }, [selectedDate]);

  async function loadReport(date) {
    setLoading(true);
    const endpoint = date === 'latest' 
      ? `${API_BASE_URL}/daily_report/latest` 
      : `${API_BASE_URL}/daily_report/${date}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('❌ Error loading report:', err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!report) return;
    const content = document.getElementById('dailyReportContent');
    if (!content) return;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<html><head><title>Trading Report</title>');
      newWindow.document.write('<style>body{font-family:sans-serif;padding:20px;}h2{margin-bottom:1rem;}table{width:100%;border-collapse:collapse;margin-top:1rem;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f0f0f0;}</style>');
      newWindow.document.write('</head><body>');
      newWindow.document.write(content.innerHTML);
      newWindow.document.write('</body></html>');
      newWindow.document.close();
      newWindow.print();
    }
  }

  return { report, dates, selectedDate, setSelectedDate, loading, downloadReport };
}
