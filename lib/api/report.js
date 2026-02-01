'use client';

import { fetchAuth } from '@/lib/api/auth';

//
// =====================================================
// 🔹 DAILY
// =====================================================
//
export const fetchDailyReportLatest = async () =>
  fetchAuth('/api/report/daily/latest');

export const fetchDailyReportByDate = async (date) =>
  fetchAuth(`/api/report/daily/by-date?date=${encodeURIComponent(date)}`);

export const fetchDailyReportDates = async () =>
  fetchAuth('/api/report/daily/history');

export const generateDailyReport = async () =>
  fetchAuth('/api/report/daily/generate', { method: 'POST' });

export const fetchDailyReportPDF = async (date) =>
  downloadPdf(
    `/api/report/daily/pdf/${encodeURIComponent(date)}`,
    `daily_report_${date}.pdf`
  );

//
// =====================================================
// 🔹 WEEKLY
// =====================================================
//
export const fetchWeeklyReportLatest = async () =>
  fetchAuth('/api/report/weekly/latest');

export const fetchWeeklyReportByDate = async (date) =>
  fetchAuth(`/api/report/weekly/by-date?date=${encodeURIComponent(date)}`);

export const fetchWeeklyReportDates = async () =>
  fetchAuth('/api/report/weekly/history');

export const generateWeeklyReport = async () =>
  fetchAuth('/api/report/weekly/generate', { method: 'POST' });

export const fetchWeeklyReportPDF = async (date) =>
  downloadPdf(
    `/api/report/weekly/pdf/${encodeURIComponent(date)}`,
    `weekly_report_${date}.pdf`
  );

//
// =====================================================
// 🔹 MONTHLY
// =====================================================
//
export const fetchMonthlyReportLatest = async () =>
  fetchAuth('/api/report/monthly/latest');

export const fetchMonthlyReportByDate = async (date) =>
  fetchAuth(`/api/report/monthly/by-date?date=${encodeURIComponent(date)}`);

export const fetchMonthlyReportDates = async () =>
  fetchAuth('/api/report/monthly/history');

export const generateMonthlyReport = async () =>
  fetchAuth('/api/report/monthly/generate', { method: 'POST' });

export const fetchMonthlyReportPDF = async (date) =>
  downloadPdf(
    `/api/report/monthly/pdf/${encodeURIComponent(date)}`,
    `monthly_report_${date}.pdf`
  );

//
// =====================================================
// 🔹 QUARTERLY
// =====================================================
//
export const fetchQuarterlyReportLatest = async () =>
  fetchAuth('/api/report/quarterly/latest');

export const fetchQuarterlyReportByDate = async (date) =>
  fetchAuth(`/api/report/quarterly/by-date?date=${encodeURIComponent(date)}`);

export const fetchQuarterlyReportDates = async () =>
  fetchAuth('/api/report/quarterly/history');

export const generateQuarterlyReport = async () =>
  fetchAuth('/api/report/quarterly/generate', { method: 'POST' });

export const fetchQuarterlyReportPDF = async (date) =>
  downloadPdf(
    `/api/report/quarterly/pdf/${encodeURIComponent(date)}`,
    `quarterly_report_${date}.pdf`
  );

//
// =====================================================
// 🧾 PDF DOWNLOAD HELPER (BROWSER-SAFE)
// =====================================================
//
async function downloadPdf(url, filename) {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // 🔥 auth cookies meesturen
    headers: {
      Accept: 'application/pdf',
    },
  });

  if (!response.ok) {
    console.error('❌ PDF response error', response.status);
    throw new Error(`PDF download mislukt (${response.status})`);
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
