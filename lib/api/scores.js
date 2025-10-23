import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

export async function getDailyScores() {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/score/daily`, 'GET');
    return await res.json();
  } catch (err) {
    console.error('❌ Fout in getDailyScores:', err);
    return null;
  }
}
