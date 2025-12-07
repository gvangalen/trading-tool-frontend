'use client';

import { fetchAuth } from '@/lib/api/auth';  // ✅ JUISTE AUTH
import { API_BASE_URL } from '@/lib/config';

//
// ========== 🔹 DAILY ==========
//
export const fetchDailyReportLatest = async () =>
  fetchAuth(`/api/report/daily/latest`);

export const fetchDailyReportByDate = async (date) =>
  fetchAuth(`/api/report/daily/by-date?date=${encodeURIComponent(date)}`);

export const fetchDailyReportDates = async () =>
  fetchAuth(`/api/report/daily/history`);

export const generateDailyReport = async () =>
  fetchAuth(`/api/report/daily/generate`, { method: 'POST' });

export const fetchDailyReportPDF = async (date) => {
  const url = `/api/report/daily/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `daily_report_${date}.pdf`);
};

//
// ========== 🔹 WEEKLY ==========
//
export const fetchWeeklyReportLatest = async () =>
  fetchAuth(`/api/report/weekly/latest`);

export const fetchWeeklyReportByDate = async (date) =>
  fetchAuth(`/api/report/weekly/by-date?date=${encodeURIComponent(date)}`);

export const fetchWeeklyReportDates = async () =>
  fetchAuth(`/api/report/weekly/history`);

export const generateWeeklyReport = async () =>
  fetchAuth(`/api/report/weekly/generate`, { method: 'POST' });

export const fetchWeeklyReportPDF = async (date) => {
  const url = `/api/report/weekly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `weekly_report_${date}.pdf`);
};

//
// ========== 🔹 MONTHLY ==========
//
export const fetchMonthlyReportLatest = async () =>
  fetchAuth(`/api/report/monthly/latest`);

export const fetchMonthlyReportByDate = async (date) =>
  fetchAuth(`/api/report/monthly/by-date?date=${encodeURIComponent(date)}`);

export const fetchMonthlyReportDates = async () =>
  fetchAuth(`/api/report/monthly/history`);

export const generateMonthlyReport = async () =>
  fetchAuth(`/api/report/monthly/generate`, { method: 'POST' });

export const fetchMonthlyReportPDF = async (date) => {
  const url = `/api/report/monthly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `monthly_report_${date}.pdf`);
};

//
// ========== 🔹 QUARTERLY ==========
//
export const fetchQuarterlyReportLatest = async () =>
  fetchAuth(`/api/report/quarterly/latest`);

export const fetchQuarterlyReportByDate = async (date) =>
  fetchAuth(`/api/report/quarterly/by-date?date=${encodeURIComponent(date)}`);

export const fetchQuarterlyReportDates = async () =>
  fetchAuth(`/api/report/quarterly/history`);

export const generateQuarterlyReport = async () =>
  fetchAuth(`/api/report/quarterly/generate`, { method: 'POST' });

export const fetchQuarterlyReportPDF = async (date) => {
  const url = `/api/report/quarterly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `quarterly_report_${date}.pdf`);
};


//
// ========== 🧾 PDF DOWNLOAD HELPER ==========
//
async function downloadPdf(url, filename) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',       // 🔥 BELANGRIJK → cookies meesturen!
      headers: { 'Accept': 'application/pdf' },
    });

    if (!response.ok) {
      throw new Error(`Fout bij ophalen PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('❌ PDF download mislukt:', error);
    throw error;
  }
}
