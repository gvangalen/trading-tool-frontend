import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal samenvatting van het dagelijkse rapport op (LET OP: correcte route!)
export const fetchDailyReportSummary = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/daily_report/summary`);
  return res.summary ? res : { summary: 'Geen samenvatting beschikbaar.' };
};

// ✅ Haal actieve trades op
export const fetchActiveTrades = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/trades/active`);
  return Array.isArray(res) ? res : [];
};

// ✅ Haal AI bot status op
export const fetchAIBotStatus = async () => {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/ai/status`);
  return res && res.state ? res : { state: 'onbekend', strategy: 'n.v.t.', updated: 'onbekend' };
};
