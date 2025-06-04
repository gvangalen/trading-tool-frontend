import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 🧠 Setup-uitleg genereren via AI
// ✅ Genereer uitleg via POST (met setup data)
export const generateAIExplanation = ({ name, indicators, trend }) =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/explain_setup`, 'POST', {
    name,
    indicators,
    trend,
  });

// 🤖 Strategie genereren via AI
// ✅ Werkt met volledige setup-object (zoals verwacht door backend)
export const generateAIStrategy = (setup) =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/strategy`, 'POST', setup);

// 🧪 Setupscore ophalen via AI (optioneel)
export const fetchAIScore = (symbol = 'BTC') =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/score?symbol=${symbol}`);
