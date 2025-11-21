import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
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


//
// =========================================================
// 2. Alle strategieën ophalen
// =========================================================
export const fetchStrategies = async (symbol = '', timeframe = '', tag = '') => {
  const url = `${API_BASE_URL}/api/strategies/query`;

  const res = await fetchWithRetry(url, 'POST', { symbol, timeframe, tag });

  if (Array.isArray(res)) return res;
  if (res?.strategies && Array.isArray(res.strategies)) return res.strategies;

  return [];
};


//
// =========================================================
// 3. Strategie bijwerken
// =========================================================
export const updateStrategy = async (id, data) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  return fetchWithRetry(url, 'PUT', data);
};


//
// =========================================================
// 4. Strategie verwijderen
// =========================================================
export const deleteStrategy = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  return fetchWithRetry(url, 'DELETE');
};


//
// =========================================================
// 5. Genereer AI-strategie (Celery starten)
// =========================================================
// Nieuwe backend stuurt: { task_id: "xxxx" }
export const generateStrategy = async (setupId, overwrite = true) => {
  const url = `${API_BASE_URL}/api/strategies/generate/${setupId}`;
  return fetchWithRetry(url, 'POST', { overwrite });
};

export const generateStrategyForSetup = generateStrategy;


//
// =========================================================
// 6. Bulk AI-generatie
// =========================================================
export const generateAllStrategies = async () => {
  const url = `${API_BASE_URL}/api/strategies/generate_all`;
  return fetchWithRetry(url, 'POST');
};


//
// =========================================================
// 7. Summary
// =========================================================
export const fetchStrategySummary = async () => {
  const url = `${API_BASE_URL}/api/strategies/summary`;
  return fetchWithRetry(url, 'GET');
};


//
// =========================================================
// 8. Score matrix
// =========================================================
export const fetchScoreMatrix = async () => {
  const url = `${API_BASE_URL}/api/strategies/score_matrix`;
  return fetchWithRetry(url, 'GET');
};


//
// =========================================================
// 9. AI Explanation ophalen
// =========================================================
export const fetchStrategyExplanation = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}/explanation`;
  return fetchWithRetry(url, 'GET');
};


//
// =========================================================
// 10. CSV Export
// =========================================================
export const exportStrategiesCSV = async () => {
  const url = `${API_BASE_URL}/api/strategies/export`;
  return fetchWithRetry(url, 'GET');
};


//
// =========================================================
// 11. Meest recente strategy
// =========================================================
export const fetchLastStrategy = async () => {
  const url = `${API_BASE_URL}/api/strategies/last`;

  const res = await fetchWithRetry(url, 'GET');

  if (res?.message === 'No strategies found') return null;
  return res || null;
};


//
// =========================================================
// 12. Strategy ophalen per setup (BELANGRIJK voor AI-refresh)
// =========================================================
export const fetchStrategyBySetup = async (setupId, type = null) => {
  const url = `${API_BASE_URL}/api/strategies/by_setup/${setupId}${
    type ? `?type=${type}` : ''
  }`;

  const res = await fetchWithRetry(url, 'GET');

  // Backend stuurt nu: { exists: true/false, strategy: {...} }
  if (!res) return null;
  if (res?.exists === false) return null;
  if (!res?.strategy) return null;

  return res;
};


//
// =========================================================
// 13. Celery task status ophalen (polling)
// =========================================================
//
// Backend stuurt nu ALTIJD:
//  { state: "SUCCESS"|"FAILURE", success: bool, ... }
//
export const fetchTaskStatus = async (taskId) => {
  const url = `${API_BASE_URL}/api/tasks/${taskId}`;

  const res = await fetchWithRetry(url, 'GET');

  if (!res) return { state: 'PENDING' };
  if (!res?.state) return { state: 'PENDING' };

  return res;
};
