import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/**
 * 📊 Haalt de dagelijkse gecombineerde scores op uit de backend.
 * Route: /api/scores/daily
 * Retourneert macro, technical, setup en market scores.
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

/**
 * 🧠 Haalt de AI Master Score op (combinatie van macro, market, technical, setup, strategy).
 * Route: /api/ai/master_score
 */
export async function getAiMasterScore() {
  try {
    const url = `${API_BASE_URL}/api/ai/master_score`;
    console.log('🧠 Ophalen van AI Master Score via:', url);

    const data = await fetchWithRetry(url, 'GET');

    if (!data || data.error) {
      console.warn('⚠️ Geen geldige master score ontvangen:', data?.error || 'leeg resultaat');
      return null;
    }

    console.log('✅ AI Master Score succesvol opgehaald:', data);
    return data;
  } catch (err) {
    console.error('❌ Fout in getAiMasterScore:', err.message || err);
    return null;
  }
}
