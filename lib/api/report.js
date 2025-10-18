import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 🔄 Genereert alle API-endpoints op basis van het rapporttype.
 * @param {string} reportType - 'daily', 'weekly', 'monthly', 'quarterly'
 */
const getEndpoints = (reportType = 'daily') => {
  const base = `${API_BASE_URL}/api/report/${reportType}`;
  return {
    latest: `${base}/latest`,           // laatste rapport
    byDate: `${base}/by-date`,          // rapport op specifieke datum (?date=...)
    history: `${base}/history`,         // lijst met beschikbare datums
    generate: `${base}/generate`,       // trigger rapportgeneratie (Celery)
    exportPdf: `${base}/export/pdf`,    // download pdf (?date=...)
  };
};

/**
 * 📄 Haal het meest recente rapport op.
 * Retourneert null bij 404 zodat de frontend fallback kan tonen.
 */
export const fetchReportLatest = async (reportType = 'daily') => {
  const { latest } = getEndpoints(reportType);
  try {
    const res = await fetchWithRetry(latest, 'GET');
    return res;
  } catch (err) {
    if (err?.message?.includes('404') || err?.status === 404) {
      console.warn(`⚠️ Geen ${reportType}-rapport gevonden (latest).`);
      return null; // laat de frontend dummy-data tonen
    }
    console.error(`❌ Fout bij ophalen van ${reportType}-rapport (latest):`, err);
    throw err;
  }
};

/**
 * 📆 Haal rapport op specifieke datum op.
 * Retourneert null bij 404 zodat de frontend fallback kan tonen.
 */
export const fetchReportByDate = async (reportType = 'daily', date) => {
  const { byDate } = getEndpoints(reportType);
  const url = `${byDate}?date=${encodeURIComponent(date)}`;
  try {
    const res = await fetchWithRetry(url, 'GET');
    return res;
  } catch (err) {
    if (err?.message?.includes('404') || err?.status === 404) {
      console.warn(`⚠️ Geen ${reportType}-rapport gevonden voor datum ${date}.`);
      return null;
    }
    console.error(`❌ Fout bij ophalen van ${reportType}-rapport (${date}):`, err);
    throw err;
  }
};

/**
 * 📆 Haal lijst met eerdere rapportdatums op.
 */
export const fetchReportDates = async (reportType = 'daily') => {
  const { history } = getEndpoints(reportType);
  try {
    return await fetchWithRetry(history, 'GET');
  } catch (err) {
    console.error(`❌ Fout bij ophalen van rapportdatums (${reportType}):`, err);
    throw err;
  }
};

/**
 * ⚙️ Start de Celery-taak om rapport te genereren.
 */
export const generateReport = async (reportType = 'daily') => {
  const { generate } = getEndpoints(reportType);
  try {
    return await fetchWithRetry(generate, 'POST');
  } catch (err) {
    console.error(`❌ Fout bij starten van ${reportType}-rapportgeneratie:`, err);
    throw err;
  }
};

/**
 * 🧾 Download rapport als PDF (verplicht met ?date=YYYY-MM-DD)
 */
export const fetchReportPDF = async (reportType = 'daily', date) => {
  const { exportPdf } = getEndpoints(reportType);
  const url = `${exportPdf}?date=${encodeURIComponent(date)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fout bij ophalen PDF: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Bestandsnaam afleiden
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
    console.error(`❌ PDF download mislukt (${reportType}):`, error);
    throw error;
  }
};
