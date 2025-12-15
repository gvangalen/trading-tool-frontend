'use client';

import { fetchAuth } from '@/lib/api/auth';

//
// =========================================================
// 1. NIEUWE STRATEGIE AANMAKEN
// =========================================================
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie verzenden naar backend:', strategyData);

  const strategyType = (strategyData.strategy_type || 'manual').toLowerCase();

  const baseRequired = ['setup_id', 'setup_name', 'symbol', 'timeframe'];

  let extraRequired = [];
  if (strategyType === 'dca') {
    extraRequired = ['amount', 'frequency'];
  } else {
    extraRequired = ['entry', 'targets', 'stop_loss'];
  }

  const required = [...baseRequired, ...extraRequired];

  for (let field of required) {
    const value = strategyData[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      throw new Error(`Veld "${field}" is verplicht.`);
    }
  }

  return await fetchAuth(`/api/strategies`, {
    method: 'POST',
    body: JSON.stringify(strategyData),
  });
};


//
// =========================================================
// 2. STRATEGIEËN OPHALEN (FILTERS)
// =========================================================
export const fetchStrategies = async (symbol = '', timeframe = '', tag = '') => {
  const res = await fetchAuth(`/api/strategies/query`, {
    method: 'POST',
    body: JSON.stringify({ symbol, timeframe, tag }),
  });

  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.strategies)) return res.strategies;
  return [];
};


//
// =========================================================
// 3. STRATEGIE UPDATEN
// =========================================================
export const updateStrategy = async (id, data) =>
  await fetchAuth(`/api/strategies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });


//
// =========================================================
// 4. STRATEGIE VERWIJDEREN
// =========================================================
export const deleteStrategy = async (id) =>
  await fetchAuth(`/api/strategies/${id}`, {
    method: 'DELETE',
  });


//
// =========================================================
// 5. AI-STRATEGIE GENEREREN (PER SETUP)
// ⚠️ maakt EENMALIG een strategie aan
// =========================================================
export const generateStrategy = async (setupId) =>
  await fetchAuth(`/api/strategies/generate/${setupId}`, {
    method: 'POST',
  });

export const generateStrategyForSetup = generateStrategy;


//
// =========================================================
// 6. BULK AI STRATEGIEGENERATIE
// =========================================================
export const generateAllStrategies = async () =>
  await fetchAuth(`/api/strategies/generate_all`, {
    method: 'POST',
  });


//
// =========================================================
// 7. STRATEGIE SAMENVATTING
// =========================================================
export const fetchStrategySummary = async () =>
  await fetchAuth(`/api/strategies/summary`, {
    method: 'GET',
  });


//
// =========================================================
// 8. SCORE MATRIX
// =========================================================
export const fetchScoreMatrix = async () =>
  await fetchAuth(`/api/strategies/score_matrix`, {
    method: 'GET',
  });


//
// =========================================================
// 9. AI-UITLEG PER STRATEGIE (oud / legacy)
// =========================================================
export const fetchStrategyExplanation = async (id) =>
  await fetchAuth(`/api/strategies/${id}/explanation`, {
    method: 'GET',
  });


//
// =========================================================
// 10. EXPORT (CSV)
// =========================================================
export const exportStrategiesCSV = async () =>
  await fetchAuth(`/api/strategies/export`, {
    method: 'GET',
  });


//
// =========================================================
// 11. MEEST RECENTE STRATEGIE
// =========================================================
export const fetchLastStrategy = async () => {
  const res = await fetchAuth(`/api/strategies/last`, { method: 'GET' });
  if (res?.message === 'No strategies found') return null;
  return res || null;
};


//
// =========================================================
// 12. STRATEGIE PER SETUP
// =========================================================
export const fetchStrategyBySetup = async (setupId, type = null) => {
  const url = `/api/strategies/by_setup/${setupId}${type ? `?type=${type}` : ''}`;

  const res = await fetchAuth(url, { method: 'GET' });
  if (!res || res?.exists === false) return null;
  return res.strategy ?? null;
};


//
// =========================================================
// 13. CELERY TASK STATUS
// =========================================================
export const fetchTaskStatus = async (taskId) =>
  await fetchAuth(`/api/tasks/${taskId}`, {
    method: 'GET',
  });


//
// =========================================================
// 14. 🧠 AI-ANALYSE VAN ÉÉN STRATEGIE  ✅ FIX
// 👉 per strategy_id
// 👉 GEEN strategie generatie
// 👉 opslag gebeurt server-side
// =========================================================
export const analyzeStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/analyze/${strategyId}`, {
    method: 'POST',
  });


//
// =========================================================
// 15. 📊 OPGEHAALDE AI-ANALYSE (PERSISTENT)
// =========================================================
export const fetchStrategyAnalysis = async (strategyId) =>
  await fetchAuth(`/api/ai/reflections/strategy?strategy_id=${strategyId}`, {
    method: 'GET',
  });
