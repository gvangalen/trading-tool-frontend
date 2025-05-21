import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 🧠 Setup-uitleg genereren via AI
export const generateAIExplanation = (setupId) =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/explain/${setupId}`);

// 🤖 Strategie genereren via AI
export const generateAIStrategy = (setupId, overwrite = true) =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/strategy/${setupId}`, 'POST', { overwrite });

// 🧪 Setupscore ophalen via AI (optioneel)
export const fetchAIScore = (symbol = 'BTC') =>
  fetchWithRetry(`${API_BASE_URL}/api/ai/score?symbol=${symbol}`);
