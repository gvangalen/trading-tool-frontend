import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ========== 🔹 DAILY ==========
export const fetchDailyReportLatest = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/daily/latest`, 'GET');
};

export const fetchDailyReportByDate = async (date) => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/daily/by-date?date=${encodeURIComponent(date)}`, 'GET');
};

export const fetchDailyReportDates = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/daily/history`, 'GET');
};

export const generateDailyReport = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/daily/generate`, 'POST');
};

export const fetchDailyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/daily/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `daily_report_${date}.pdf`);
};

// ========== 🔹 WEEKLY ==========
export const fetchWeeklyReportLatest = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/weekly/latest`, 'GET');
};

export const fetchWeeklyReportByDate = async (date) => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/weekly/by-date?date=${encodeURIComponent(date)}`, 'GET');
};

export const fetchWeeklyReportDates = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/weekly/history`, 'GET');
};

export const generateWeeklyReport = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/weekly/generate`, 'POST');
};

export const fetchWeeklyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/weekly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `weekly_report_${date}.pdf`);
};

// ========== 🔹 MONTHLY ==========
export const fetchMonthlyReportLatest = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/monthly/latest`, 'GET');
};

export const fetchMonthlyReportByDate = async (date) => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/monthly/by-date?date=${encodeURIComponent(date)}`, 'GET');
};

export const fetchMonthlyReportDates = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/monthly/history`, 'GET');
};

export const generateMonthlyReport = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/monthly/generate`, 'POST');
};

export const fetchMonthlyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/monthly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `monthly_report_${date}.pdf`);
};

// ========== 🔹 QUARTERLY ==========
export const fetchQuarterlyReportLatest = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/quarterly/latest`, 'GET');
};

export const fetchQuarterlyReportByDate = async (date) => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/quarterly/by-date?date=${encodeURIComponent(date)}`, 'GET');
};

export const fetchQuarterlyReportDates = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/quarterly/history`, 'GET');
};

export const generateQuarterlyReport = async () => {
  return fetchWithRetry(`${API_BASE_URL}/api/report/quarterly/generate`, 'POST');
};

export const fetchQuarterlyReportPDF = async (date) => {
  const url = `${API_BASE_URL}/api/report/quarterly/export/pdf?date=${encodeURIComponent(date)}`;
  return downloadPdf(url, `quarterly_report_${date}.pdf`);
};

// ========== 🧾 PDF Download Helper ==========
async function downloadPdf(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fout bij ophalen PDF: ${response.statusText}`);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error(`❌ PDF download mislukt:`, error);
    throw error;
  }
}
