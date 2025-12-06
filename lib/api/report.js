'use client';

import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { API_BASE_URL } from '@/lib/config';

//
// ========== 🔹 DAILY ==========
//
export const fetchDailyReportLatest = async () =>
  fetchWithAuth(`/api/report/daily/latest`, 'GET');

export const fetchDailyReportByDate = async (date) =>
  fetchWithAuth(`/api/report/daily/by-date?date=${encodeURIComponent(date)}`, 'GET');

export const fetchDailyReportDates = async () =>
  fetchWithAuth(`/api/report/daily/history`, 'GET');

export const generateDailyReport = async () =>
  fetchWithAuth(`/api/report/daily/generate`, 'POST');

export const fetchDailyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/daily/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `daily_report_${date}.pdf`);
};

//
// ========== 🔹 WEEKLY ==========
//
export const fetchWeeklyReportLatest = async () =>
  fetchWithAuth(`/api/report/weekly/latest`, 'GET');

export const fetchWeeklyReportByDate = async (date) =>
  fetchWithAuth(`/api/report/weekly/by-date?date=${encodeURIComponent(date)}`, 'GET');

export const fetchWeeklyReportDates = async () =>
  fetchWithAuth(`/api/report/weekly/history`, 'GET');

export const generateWeeklyReport = async () =>
  fetchWithAuth(`/api/report/weekly/generate`, 'POST');

export const fetchWeeklyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/weekly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `weekly_report_${date}.pdf`);
};

//
// ========== 🔹 MONTHLY ==========
//
export const fetchMonthlyReportLatest = async () =>
  fetchWithAuth(`/api/report/monthly/latest`, 'GET');

export const fetchMonthlyReportByDate = async (date) =>
  fetchWithAuth(`/api/report/monthly/by-date?date=${encodeURIComponent(date)}`, 'GET');

export const fetchMonthlyReportDates = async () =>
  fetchWithAuth(`/api/report/monthly/history`, 'GET');

export const generateMonthlyReport = async () =>
  fetchWithAuth(`/api/report/monthly/generate`, 'POST');

export const fetchMonthlyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/monthly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `monthly_report_${date}.pdf`);
};

//
// ========== 🔹 QUARTERLY ==========
//
export const fetchQuarterlyReportLatest = async () =>
  fetchWithAuth(`/api/report/quarterly/latest`, 'GET');

export const fetchQuarterlyReportByDate = async (date) =>
  fetchWithAuth(`/api/report/quarterly/by-date?date=${encodeURIComponent(date)}`, 'GET');

export const fetchQuarterlyReportDates = async () =>
  fetchWithAuth(`/api/report/quarterly/history`, 'GET');

export const generateQuarterlyReport = async () =>
  fetchWithAuth(`/api/report/quarterly/generate`, 'POST');

export const fetchQuarterlyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/quarterly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `quarterly_report_${date}.pdf`);
};


//
// ========== 🧾 PDF DOWNLOAD HELPER ==========
//
async function downloadPdf(url, filename) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' }
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
