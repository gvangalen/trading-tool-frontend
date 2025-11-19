import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// =========================================================
// 1. Nieuwe strategie aanmaken
// =========================================================
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie wordt verzonden naar backend:', strategyData);

  const strategyType = (strategyData.strategy_type || 'manual').toLowerCase();
  const baseRequired = ['setup_id', 'setup_name', 'symbol', 'timeframe'];

  let extraRequired = [];
  if (strategyType === 'dca') {
    extraRequired = ['amount', 'frequency'];
  } else if (strategyType === 'manual' || strategyType === 'trading') {
    extraRequired = ['entry', 'targets', 'stop_loss'];
  } else {
    console.error(`❌ Onbekend strategy_type: ${strategyType}`);
    throw new Error(`Onbekend strategy_type: ${strategyType}`);
  }

  const required = [...baseRequired, ...extraRequired];

  for (let field of required) {
    if (
      strategyData[field] === undefined ||
      strategyData[field] === null ||
      (typeof strategyData[field] === 'string' && strategyData[field].trim() === '') ||
      (Array.isArray(strategyData[field]) && strategyData[field].length === 0)
    ) {
      throw new Error(`Veld "${field}" is verplicht.`);
    }
  }

  const url = `${API_BASE_URL}/api/strategies`;
  console.log(`🔍 [createStrategy] POST naar ${url}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategyData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`❌ Strategie maken mislukt: ${errorText}`);
  }

  return await res.json();
};

// =========================================================
// 2. Alle strategieën ophalen
// =========================================================
export const fetchStrategies = async (symbol = '', timeframe = '', tag = '') => {
  const url = `${API_BASE_URL}/api/strategies/query`;
  console.log(`[fetchStrategies] POST naar ${url}`, { symbol, timeframe, tag });

  const res = await fetchWithRetry(url, 'POST', { symbol, timeframe, tag });

  if (Array.isArray(res)) return res;
  if (res?.strategies && Array.isArray(res.strategies)) return res.strategies;

  return [];
};

// =========================================================
// 3. Strategie bijwerken
// =========================================================
export const updateStrategy = async (id, data) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  return fetchWithRetry(url, 'PUT', data);
};

// =========================================================
// 4. Strategie verwijderen
// =========================================================
export const deleteStrategy = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  return fetchWithRetry(url, 'DELETE');
};

// =========================================================
// 5. Genereer AI-strategie (start Celery)
// =========================================================
export const generateStrategy = async (id, overwrite = true) => {
  const url = `${API_BASE_URL}/api/strategies/generate/${id}`;
  return fetchWithRetry(url, 'POST', { overwrite });
};

export const generateStrategyForSetup = generateStrategy;

// =========================================================
// 6. Bulk AI-generatie voor alle setups
// =========================================================
export const generateAllStrategies = async () => {
  const url = `${API_BASE_URL}/api/strategies/generate_all`;
  return fetchWithRetry(url, 'POST');
};

// =========================================================
// 7. Strategy summary
// =========================================================
export const fetchStrategySummary = async () => {
  const url = `${API_BASE_URL}/api/strategies/summary`;
  return fetchWithRetry(url, 'GET');
};

// =========================================================
// 8. Score-matrix
// =========================================================
export const fetchScoreMatrix = async () => {
  const url = `${API_BASE_URL}/api/strategies/score_matrix`;
  return fetchWithRetry(url, 'GET');
};

// =========================================================
// 9. AI explanation ophalen
// =========================================================
export const fetchStrategyExplanation = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}/explanation`;
  return fetchWithRetry(url, 'GET');
};

// =========================================================
// 10. CSV export
// =========================================================
export const exportStrategiesCSV = async () => {
  const url = `${API_BASE_URL}/api/strategies/export`;
  return fetchWithRetry(url, 'GET');
};

// =========================================================
// 11. Meest recente strategy
// =========================================================
export const fetchLastStrategy = async () => {
  const url = `${API_BASE_URL}/api/strategies/last`;
  const res = await fetchWithRetry(url, 'GET');
  return res?.message ? null : res;
};

// =========================================================
// 12. 🆕 Strategy ophalen per setup (nodig voor AI-update)
// =========================================================
export const fetchStrategyBySetup = async (setupId, type = null) => {
  const url = `${API_BASE_URL}/api/strategies/by_setup/${setupId}${
    type ? `?type=${type}` : ''
  }`;

  console.log(`[fetchStrategyBySetup] GET ${url}`);
  return fetchWithRetry(url, 'GET');
};

// =========================================================
// 13. 🆕 Celery taakstatus ophalen (polling)
// =========================================================
export const fetchTaskStatus = async (taskId) => {
  const url = `${API_BASE_URL}/api/tasks/status/${taskId}`;
  console.log(`[fetchTaskStatus] GET ${url}`);
  return fetchWithRetry(url, 'GET');
};
