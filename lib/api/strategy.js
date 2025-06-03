import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
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

// ✅ Strategieën ophalen (filterbaar)
export const fetchStrategies = (asset = '', timeframe = '') =>
  fetchWithRetry(`${API_BASE_URL}/api/strategieën?asset=${asset}&timeframe=${timeframe}`);

// 📝 Strategie bijwerken
export const updateStrategy = (id, data) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategieën/${id}`, 'PUT', data);

// 🗑️ Strategie verwijderen
export const deleteStrategy = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategieën/${id}`, 'DELETE');

// 🤖 Genereer AI-strategie voor één setup
export const generateStrategy = (id, overwrite = true) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategie/generate/${id}`, 'POST', { overwrite });

// 🔁 Genereer alle strategieën via AI
export const generateAllStrategies = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategie/generate_all`, 'POST');

// 📦 Alle setups ophalen (dropdown)
export const fetchSetups = () =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`);
