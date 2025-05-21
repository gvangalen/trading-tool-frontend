import { fetchWithRetry } from '@lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ➕ Strategie aanmaken
export const createStrategy = async (strategyData) => {
  const res = await fetch(`${API_BASE_URL}/api/strategieën`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategyData),
  });

  if (!res.ok) throw new Error('❌ Strategie aanmaken mislukt');
  return res.json();
};

// ✅ Strategieën ophalen
export const fetchStrategies = (asset = '', timeframe = '') =>
  fetchWithRetry(`/api/strategieën?asset=${asset}&timeframe=${timeframe}`);

// 📝 Strategie bijwerken
export const updateStrategy = (id, data) =>
  fetchWithRetry(`/api/strategieën/${id}`, 'PUT', data);

// 🗑️ Strategie verwijderen
export const deleteStrategy = (id) =>
  fetchWithRetry(`/api/strategieën/${id}`, 'DELETE');

// 🤖 AI-strategie genereren voor één setup
export const generateStrategy = (id, overwrite = true) =>
  fetchWithRetry(`/api/strategie/generate/${id}`, 'POST', { overwrite });

// 🔁 AI alle strategieën opnieuw genereren
export const generateAllStrategies = () =>
  fetchWithRetry(`/api/strategie/generate_all`, 'POST');

// 📦 Alle setups ophalen (voor dropdown bij strategie)
export const fetchSetups = () =>
  fetchWithRetry('/api/setups');
