import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal samenvatting van het dagelijkse rapport op
export const fetchDailyReportSummary = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/daily_report/summary`);
  return res.summary ? res : { summary: 'Geen samenvatting beschikbaar.' };
};

// ✅ Haal actieve trades op
export const fetchActiveTrades = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/trades/active`);
  return Array.isArray(res) ? res : [];
};

// ✅ Haal AI bot status op (correcte mapping van backendsleutels naar frontendverwachting)
export const fetchAIBotStatus = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/status`);
  return res && res.status
    ? {
        state: res.status,              // 'actief' of iets anders
        strategy: res.strategie,        // bijv. 'DCA + Swing'
        updated: res.laatste_update     // bijv. '2025-07-12T13:00:00'
      }
    : {
        state: 'onbekend',
        strategy: 'n.v.t.',
        updated: 'onbekend'
      };
};
