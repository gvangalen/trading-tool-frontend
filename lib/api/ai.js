import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/*  
🧠 1. Genereer setup-uitleg via AI
- Vereist: name, indicators, trend
*/
export const generateAIExplanation = ({ name, indicators, trend }) =>
  fetchWithRetry(`${API_BASE_URL}/ai/explain_setup`, 'POST', {
    name,
    indicators,
    trend,
  });

/*  
🤖 2. Genereer strategie via AI 
- Werkt met volledig setup-object (zoals verwacht in backend)
*/
export const generateAIStrategy = (setup) =>
  fetchWithRetry(`${API_BASE_URL}/ai/strategy`, 'POST', setup);

/*  
📊 3. Haal AI-score op voor specifieke asset
- Default: BTC (optioneel symbol meegeven)
*/
export const fetchAIScore = (symbol = 'BTC') =>
  fetchWithRetry(`${API_BASE_URL}/ai/score?symbol=${symbol}`, 'GET');
