import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 🟢 Enige echte API call die nog bestaat
export const fetchDailyReportSummary = async () => {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/daily_report/summary`);
    return res.summary ? res : { summary: 'Geen samenvatting beschikbaar.' };
  } catch (e) {
    return { summary: 'Geen samenvatting beschikbaar.' };
  }
};

// 🟡 Deze bestaan niet meer → ZET ZE UIT
// export const fetchActiveTrades = async () => [];
// export const fetchAIBotStatus = async () => ({});
