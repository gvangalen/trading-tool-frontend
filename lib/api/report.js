import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 🔄 Map reportType naar API pad
const getEndpoint = (reportType = 'daily') => {
  return {
    base: `${API_BASE_URL}/api/${reportType}_report`,       // bv. /api/daily_report
    history: `${API_BASE_URL}/api/${reportType}_report/history`,
    summary: `${API_BASE_URL}/api/${reportType}_report/summary`,
    generate: `${API_BASE_URL}/api/${reportType}_report/generate`,
    export: `${API_BASE_URL}/api/${reportType}_report/export/pdf`,
  };
};

// 📆 Haal lijst van beschikbare rapportdatums op
export const fetchReportDates = (reportType = 'daily') => {
  const { history } = getEndpoint(reportType);
  return fetchWithRetry(history, 'GET');
};

// 📄 Haal rapport op voor een specifieke datum of 'latest'
export const fetchReportByDate = (reportType = 'daily', date = 'latest') => {
  const { base } = getEndpoint(reportType);
  const endpoint = date === 'latest' ? `${base}/latest` : `${base}/${date}`;
  return fetchWithRetry(endpoint, 'GET');
};

// 📑 Haal samenvatting van laatste rapport op
export const fetchReportSummary = (reportType = 'daily') => {
  const { summary } = getEndpoint(reportType);
  return fetchWithRetry(summary, 'GET');
};

// 🧾 Download rapport als PDF (laatste of op datum)
export const fetchReportPDF = (reportType = 'daily', date = 'latest') => {
  const { export: exportEndpoint } = getEndpoint(reportType);
  return fetchWithRetry(`${exportEndpoint}?date=${date}`, 'GET');
};

// ⚙️ Trigger genereren van een rapport (via Celery)
export const generateReport = (reportType = 'daily') => {
  const { generate } = getEndpoint(reportType);
  return fetchWithRetry(generate, 'POST');
};
