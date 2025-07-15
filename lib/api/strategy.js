import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ➕ 1. Create a new strategy
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie wordt verzonden naar backend:', strategyData);

  const res = await fetch(`${API_BASE_URL}/api/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategyData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Backend error bij strategy POST:', errorText);
    throw new Error(`❌ Strategie maken mislukt: ${errorText}`);
  }

  return res.json();
};

// 📥 2. Fetch all strategies (gebruikt POST met filters)
export const fetchStrategies = async (asset = '', timeframe = '', tag = '') => {
  return fetchWithRetry(`${API_BASE_URL}/api/strategies`, 'POST', {
    asset,
    timeframe,
    tag,
  });
};

// ✏️ 3. Update an existing strategy
export const updateStrategy = (id, data) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}`, 'PUT', data);

// 🗑️ 4. Delete a strategy
export const deleteStrategy = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}`, 'DELETE');

// 🤖 5. Genereer AI-strategie voor één setup
export const generateStrategy = (id, overwrite = true) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/generate/${id}`, 'POST', { overwrite });

// ✅ Alias voor eenvoud
export const generateStrategyForSetup = generateStrategy;

// 🔁 6. Genereer AI-strategieën voor alle setups
export const generateAllStrategies = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/generate_all`, 'POST');

// 📊 7. Haal samenvatting op (gemiddelde score per asset)
export const fetchStrategySummary = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/summary`, 'GET');

// 🧮 8. Score-matrix opvragen (asset × timeframe)
export const fetchScoreMatrix = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/score_matrix`, 'GET');

// 🧠 9. AI-uitleg bij strategie ophalen
export const fetchStrategyExplanation = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/${id}/explanation`, 'GET');

// 📤 10. Exporteer alle strategieën als CSV
export const exportStrategiesCSV = () =>
  fetchWithRetry(`${API_BASE_URL}/api/strategies/export`, 'GET');

// 📦 11. Haal alle setups op (voor dropdown/selectie)
export const fetchSetups = () =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`, 'GET');
