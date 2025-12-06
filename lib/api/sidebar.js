'use client';

import { fetchAuth as fetchWithAuth } from '@/lib/auth/apiClient';

/**
 * 🟢 Dagelijkse rapport-samenvatting (AUTH verplicht)
 *
 * Endpoint: /api/daily_report/summary
 * Gebruikt in:
 *  - Dashboard sidebar
 *  - Daily report widgets
 */
export const fetchDailyReportSummary = async () => {
  try {
    const res = await fetchWithAuth(`/api/daily_report/summary`, 'GET');

    // Backend stuurt: { summary: "..." }
    if (res?.summary && typeof res.summary === 'string' && res.summary.length > 0) {
      return res;
    }

    return { summary: 'Geen samenvatting beschikbaar.' };

  } catch (e) {
    console.error('❌ [fetchDailyReportSummary] Error:', e);
    return { summary: 'Geen samenvatting beschikbaar.' };
  }
};
