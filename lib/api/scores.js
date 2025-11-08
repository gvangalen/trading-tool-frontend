import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 📊 Haalt de dagelijkse gecombineerde scores op uit de backend.
 * - Route: /api/scores/daily
 * - Retourneert macro, technical, setup en market scores
 * - Bevat automatische retry-logica en foutafhandeling
 */
export async function getDailyScores() {
  try {
    const url = `${API_BASE_URL}/api/scores/daily`;
    console.log('🌍 Ophalen van daily scores via:', url);

    const data = await fetchWithRetry(url, 'GET');

    if (!data) {
      console.warn('⚠️ API gaf geen data terug (null of leeg object).');
      return null;
    }

    console.log('✅ Daily scores succesvol opgehaald:', data);
    return data;
  } catch (err) {
    console.error('❌ Fout in getDailyScores:', err.message || err);
    return null;
  }
}
