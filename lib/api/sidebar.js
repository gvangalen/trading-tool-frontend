'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 🟢 Enige nog actieve endpoint:
 *    /api/daily_report/summary
 *
 * Gebruikt in:
 *  - Dashboard sidebar
 *  - Mogelijk in report cards
 */
export const fetchDailyReportSummary = async () => {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/daily_report/summary`, 'GET');

    // Backend stuurt: { summary: "..." }
    if (res && typeof res.summary === 'string' && res.summary.length > 0) {
      return res;
    }

    return { summary: 'Geen samenvatting beschikbaar.' };

  } catch (e) {
    console.error('❌ Fout in fetchDailyReportSummary:', e);
    return { summary: 'Geen samenvatting beschikbaar.' };
  }
};
