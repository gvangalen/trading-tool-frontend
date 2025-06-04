import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ➕ Create a new strategy
export const createStrategy = async (strategyData) => {
  const res = await fetch(`${API_BASE_URL}/api/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategyData),
  });

  if (!res.ok) throw new Error('❌ Failed to create strategy');
  return res.json();
};

// 📥 Fetch all strategies (optionally filter by asset/timeframe)
export const fetchStrategies = (asset = '', timeframe = '') =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies?asset=${asset}&timeframe=${timeframe}`);

// ✏️ Update an existing strategy
export const updateStrategy = (id, data) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}`, 'PUT', data);

// 🗑️ Delete a strategy
export const deleteStrategy = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}`, 'DELETE');

// 🤖 Generate AI strategy for a single setup
export const generateStrategy = (id, overwrite = true) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategy/generate/${id}`, 'POST', { overwrite });

// 🔁 Generate AI strategies for all setups
export const generateAllStrategies = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategy/generate_all`, 'POST');

// 📦 Fetch all setups (for dropdowns etc.)
export const fetchSetups = () =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`);

// 📊 Fetch strategy summary (per asset)
export const fetchStrategySummary = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/summary`, 'GET');

// 🧮 Fetch average score matrix (asset × timeframe)
export const fetchScoreMatrix = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/score_matrix`, 'GET');

// 🧠 Fetch explanation & AI reason for a strategy
export const fetchStrategyExplanation = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}/explanation`, 'GET');

// 📤 Export all strategies as CSV
export const exportStrategiesCSV = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/export`, 'GET');
