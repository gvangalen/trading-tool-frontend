import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 🔄 Genereert alle API-endpoints op basis van het rapporttype.
 * @param {string} reportType - 'daily', 'weekly', 'monthly', 'quarterly'
 */
const getEndpoints = (reportType = 'daily') => {
  const base = `${API_BASE_URL}/api/report/${reportType}`;
  return {
    latest: `${base}/latest`,           // laatste rapport (bv. /api/report/daily/latest)
    byDate: `${base}/by-date`,          // rapport met ?date=...
    history: `${base}/history`,         // lijst van datums
    generate: `${base}/generate`,       // trigger rapport
    exportPdf: `${base}/export/pdf`,    // download pdf met ?date=...
  };
};

// 📄 Haal het meest recente rapport op
export const fetchReportLatest = (reportType = 'daily') => {
  const { latest } = getEndpoints(reportType);
  return fetchWithRetry(latest, 'GET');
};

// 📆 Haal rapport op specifieke datum op
export const fetchReportByDate = (reportType = 'daily', date) => {
  const { byDate } = getEndpoints(reportType);
  const url = `${byDate}?date=${encodeURIComponent(date)}`;
  return fetchWithRetry(url, 'GET');
};

// 📆 Haal lijst met eerdere rapportdatums op
export const fetchReportDates = (reportType = 'daily') => {
  const { history } = getEndpoints(reportType);
  return fetchWithRetry(history, 'GET');
};

// ⚙️ Start de Celery-taak om rapport te genereren
export const generateReport = (reportType = 'daily') => {
  const { generate } = getEndpoints(reportType);
  return fetchWithRetry(generate, 'POST');
};

// 🧾 Download rapport als PDF (verplicht met ?date=YYYY-MM-DD)
export const fetchReportPDF = async (reportType = 'daily', date) => {
  const { exportPdf } = getEndpoints(reportType);
  const url = `${exportPdf}?date=${encodeURIComponent(date)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fout bij ophalen PDF: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Probeer bestandsnaam af te leiden uit headers
    const disposition = response.headers.get('Content-Disposition');
    const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : `${reportType}_report_${date}.pdf`;

    // Start download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('❌ PDF download mislukt:', error);
    throw error;
  }
};
