import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Bouw correcte backend route
const getEndpoint = (reportType = 'daily') => {
  return {
    base: `${API_BASE_URL}/api/report/${reportType}`,       // bv. /api/report/daily
    history: `${API_BASE_URL}/api/report/${reportType}/history`,
    generate: `${API_BASE_URL}/api/report/${reportType}/generate`,
    export: `${API_BASE_URL}/api/report/${reportType}/export/pdf`,
  };
};

// 📆 Haal lijst van beschikbare rapportdatums op
export const fetchReportDates = (reportType = 'daily') => {
  const { history } = getEndpoint(reportType);
  return fetchWithRetry(history, 'GET');
};

// 📄 Haal rapport op (altijd laatste want backend geeft alleen latest)
export const fetchReportLatest = (reportType = 'daily') => {
  const { base } = getEndpoint(reportType);
  return fetchWithRetry(base, 'GET');
};

// 🧾 Download rapport als PDF (verplicht met ?date=)
export const fetchReportPDF = (reportType = 'daily', date) => {
  const { export: exportEndpoint } = getEndpoint(reportType);
  return fetchWithRetry(`${exportEndpoint}?date=${date}`, 'GET');
};

// ⚙️ Start genereren van rapport (via Celery)
export const generateReport = (reportType = 'daily') => {
  const { generate } = getEndpoint(reportType);
  return fetchWithRetry(generate, 'POST');
};
