import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ➕ 1. Maak een nieuwe strategie aan
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie wordt verzonden naar backend:', strategyData);

  const strategyType = (strategyData.strategy_type || 'manual').toLowerCase();

  // Algemene verplichte velden voor alle types
  const baseRequired = ['setup_id', 'setup_name', 'asset', 'timeframe'];

  // Extra verplichte velden per type
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

  // Validatie van verplichte velden
  for (let field of required) {
    if (
      strategyData[field] === undefined ||
      strategyData[field] === null ||
      (typeof strategyData[field] === 'string' && strategyData[field].trim() === '') ||
      (Array.isArray(strategyData[field]) && strategyData[field].length === 0)
    ) {
      console.error(`❌ Verplicht veld ontbreekt: ${field}`);
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

  console.log(`[createStrategy] Response status: ${res.status}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Backend error bij strategy POST:', errorText);
    throw new Error(`❌ Strategie maken mislukt: ${errorText}`);
  }

  const json = await res.json();
  console.log('[createStrategy] Response JSON:', json);

  return json;
};

// 📥 2. Alle strategieën ophalen (✅ FIXED)
export const fetchStrategies = async (asset = '', timeframe = '', tag = '') => {
  const url = `${API_BASE_URL}/api/strategies/query`;
  console.log(`🔍 [fetchStrategies] POST naar ${url} met filters`, { asset, timeframe, tag });

  const res = await fetchWithRetry(url, 'POST', { asset, timeframe, tag });

  console.log('[fetchStrategies] Response:', res);

  if (Array.isArray(res)) return res;
  if (res?.strategies && Array.isArray(res.strategies)) return res.strategies;

  console.warn('⚠️ Onverwachte strategie data:', res);
  return [];
};

// ✏️ 3. Strategie bijwerken
export const updateStrategy = async (id, data) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  console.log(`🔍 [updateStrategy] PUT naar ${url} met data`, data);
  return fetchWithRetry(url, 'PUT', data);
};

// 🗑️ 4. Strategie verwijderen
export const deleteStrategy = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  console.log(`🔍 [deleteStrategy] DELETE naar ${url}`);
  return fetchWithRetry(url, 'DELETE');
};

// 🤖 5. Genereer AI-strategie voor één setup
export const generateStrategy = async (id, overwrite = true) => {
  const url = `${API_BASE_URL}/api/strategies/generate/${id}`;
  console.log(`🔍 [generateStrategy] POST naar ${url} met overwrite=${overwrite}`);
  return fetchWithRetry(url, 'POST', { overwrite });
};

// ✅ Alias
export const generateStrategyForSetup = generateStrategy;

// 🔁 6. Genereer AI-strategieën voor alle setups
export const generateAllStrategies = async () => {
  const url = `${API_BASE_URL}/api/strategies/generate_all`;
  console.log(`🔍 [generateAllStrategies] POST naar ${url}`);
  return fetchWithRetry(url, 'POST');
};

// 📊 7. Samenvatting van strategieën ophalen
export const fetchStrategySummary = async () => {
  const url = `${API_BASE_URL}/api/strategies/summary`;
  console.log(`🔍 [fetchStrategySummary] GET naar ${url}`);
  return fetchWithRetry(url, 'GET');
};

// 🧮 8. Score-matrix ophalen (asset × timeframe)
export const fetchScoreMatrix = async () => {
  const url = `${API_BASE_URL}/api/strategies/score_matrix`;
  console.log(`🔍 [fetchScoreMatrix] GET naar ${url}`);
  return fetchWithRetry(url, 'GET');
};

// 🧠 9. AI-uitleg bij strategie ophalen
export const fetchStrategyExplanation = async (id) => {
  const url = `${API_BASE_URL}/api/strategies/${id}/explanation`;
  console.log(`🔍 [fetchStrategyExplanation] GET naar ${url}`);
  return fetchWithRetry(url, 'GET');
};

// 📤 10. Exporteer alle strategieën als CSV
export const exportStrategiesCSV = async () => {
  const url = `${API_BASE_URL}/api/strategies/export`;
  console.log(`🔍 [exportStrategiesCSV] GET naar ${url}`);
  return fetchWithRetry(url, 'GET');
};