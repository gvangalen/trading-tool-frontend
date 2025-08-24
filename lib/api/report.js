import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 🔄 Genereert alle API-endpoints op basis van het rapporttype.
 * @param {string} reportType - 'daily', 'weekly', 'monthly', 'quarterly'
 */
const getEndpoints = (reportType = 'daily') => {
  const base = `${API_BASE_URL}/api/report/${reportType}`;
  return {
    latest: base, // laatste rapport (bv. /api/report/daily)
    history: `${base}/history`, // lijst van datums
    generate: `${base}/generate`, // trigger rapport
    exportPdf: `${base}/export/pdf`, // download pdf met ?date=...
  };
};

// 📄 Haal het meest recente rapport op
export const fetchReportLatest = (reportType = 'daily') => {
  const { latest } = getEndpoints(reportType);
  return fetchWithRetry(latest, 'GET');
};

// 📆 Haal lijst met eerdere rapportdatums op
export const fetchReportDates = (reportType = 'daily') => {
  const { history } = getEndpoints(reportType);
  return fetchWithRetry(history, 'GET');
};

// 🧾 Download rapport als PDF (verplicht met ?date=YYYY-MM-DD)
export const fetchReportPDF = (reportType = 'daily', date) => {
  const { exportPdf } = getEndpoints(reportType);
  return fetchWithRetry(`${exportPdf}?date=${encodeURIComponent(date)}`, 'GET');
};

// ⚙️ Start de Celery-taak om rapport te genereren
export const generateReport = (reportType = 'daily') => {
  const { generate } = getEndpoints(reportType);
  return fetchWithRetry(generate, 'POST');
};
