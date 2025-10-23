import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

export async function getDailyScores() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/scores/daily`, 'GET');
    return data;
  } catch (err) {
    console.error('❌ Fout in getDailyScores:', err.message || err);
    return null;
  }
}
