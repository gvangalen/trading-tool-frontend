import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📆 Haal lijst van beschikbare rapportdatums op
export const fetchReportDates = () =>
  fetchWithRetry(`${API_BASE_URL}/api/daily_report/history`, 'GET');

// 📄 Haal rapport op voor een specifieke datum of 'latest'
export const fetchReportByDate = (date) => {
  const endpoint =
    date === 'latest'
      ? `${API_BASE_URL}/api/daily_report/latest`
      : `${API_BASE_URL}/api/daily_report/${date}`;
  return fetchWithRetry(endpoint, 'GET');
};

// 📑 Haal de samenvatting van het laatste rapport op
export const fetchReportSummary = () =>
  fetchWithRetry(`${API_BASE_URL}/api/daily_report/summary`, 'GET');

// 🧾 Download rapport als PDF (laatste of op datum)
export const fetchReportPDF = (date = 'latest') =>
  fetchWithRetry(`${API_BASE_URL}/api/daily_report/export/pdf?date=${date}`, 'GET');

// ⚙️ Trigger genereren van nieuw rapport (via Celery-task)
export const generateDailyReport = () =>
  fetchWithRetry(`${API_BASE_URL}/api/daily_report/generate`, 'POST');
