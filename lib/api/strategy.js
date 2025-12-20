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
// 9. EXPORT (CSV)
// =========================================================
export const exportStrategiesCSV = async () =>
  await fetchAuth(`/api/strategies/export`, {
    method: 'GET',
  });


//
// =========================================================
// 10. MEEST RECENTE STRATEGIE
// =========================================================
export const fetchLastStrategy = async () => {
  const res = await fetchAuth(`/api/strategies/last`, { method: 'GET' });
  if (res?.message === 'No strategies found') return null;
  return res || null;
};


//
// =========================================================
// 11. STRATEGIE PER SETUP
// =========================================================
export const fetchStrategyBySetup = async (setupId, type = null) => {
  const url = `/api/strategies/by_setup/${setupId}${type ? `?type=${type}` : ''}`;

  const res = await fetchAuth(url, { method: 'GET' });
  if (!res || res?.exists === false) return null;
  return res.strategy ?? null;
};


//
// =========================================================
// 12. CELERY TASK STATUS (optioneel)
// =========================================================
export const fetchTaskStatus = async (taskId) =>
  await fetchAuth(`/api/tasks/${taskId}`, {
    method: 'GET',
  });


//
// =========================================================
// 13. 🧠 AI-ANALYSE VAN ÉÉN STRATEGIE (V1)
// 👉 zelfde gedrag als Setup AI-uitleg
// 👉 AI schrijft naar strategy.data.ai_explanation
// =========================================================
export const analyzeStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/analyze/${strategyId}`, {
    method: 'POST',
  });

//
// =========================================================
// 14. 🎯 ACTIEVE STRATEGIE VANDAAG
// 👉 gebruikt door:
// - useActiveStrategyToday hook
// - Strategy dashboard cards
// - AI Agent Insight Panel
// =========================================================
export const fetchActiveStrategyToday = async () => {
  const res = await fetchAuth(`/api/strategy/active-today`, {
    method: 'GET',
  });

  if (!res || res?.exists === false) return null;
  return res;
};
