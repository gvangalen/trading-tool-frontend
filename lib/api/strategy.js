'use client';

import { fetchAuth } from '@/lib/api/auth';

//
// =========================================================
// 1. NIEUWE STRATEGIE AANMAKEN
// =========================================================
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie verzenden naar backend:', strategyData);

  if (!strategyData?.strategy_type) {
    throw new Error('strategy_type ontbreekt.');
  }

  if (!strategyData?.setup_id) {
    throw new Error('setup_id is verplicht.');
  }

  const type = strategyData.strategy_type.toLowerCase();

  // ---------------------------------------------------------
  // DCA VALIDATIE
  // ---------------------------------------------------------
  if (type === 'dca') {
    const required = ['base_amount', 'frequency', 'execution_mode'];

    for (const field of required) {
      if (
        strategyData[field] === undefined ||
        strategyData[field] === null ||
        strategyData[field] === ''
      ) {
        throw new Error(`Veld "${field}" is verplicht voor DCA.`);
      }
    }

    if (
      strategyData.execution_mode !== 'fixed' &&
      !strategyData.decision_curve
    ) {
      throw new Error(
        'decision_curve is verplicht bij execution_mode ≠ fixed.'
      );
    }
  }

  // ---------------------------------------------------------
  // TRADING / MANUAL VALIDATIE
  // ---------------------------------------------------------
  if (type === 'trading' || type === 'manual') {
    const required = ['entry', 'targets', 'stop_loss'];

    for (const field of required) {
      if (
        strategyData[field] === undefined ||
        strategyData[field] === null ||
        strategyData[field] === '' ||
        (Array.isArray(strategyData[field]) &&
          strategyData[field].length === 0)
      ) {
        throw new Error(`Veld "${field}" is verplicht.`);
      }
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
export const fetchStrategies = async (
  symbol = '',
  timeframe = '',
  tag = ''
) => {
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
// =========================================================
export const generateStrategyForSetup = async (setupId) =>
  await fetchAuth(`/api/strategies/generate/${setupId}`, {
    method: 'POST',
  });

//
// =========================================================
// 6. BULK AI STRATEGIEGENERATIE
// ⚠️ Check of backend route bestaat!
// =========================================================
export const generateAllStrategies = async () =>
  await fetchAuth(`/api/strategies/generate_all`, {
    method: 'POST',
  });

//
// =========================================================
// 7. STRATEGIE SAMENVATTING
// ⚠️ Check backend
// =========================================================
export const fetchStrategySummary = async () =>
  await fetchAuth(`/api/strategies/summary`, {
    method: 'GET',
  });

//
// =========================================================
// 8. SCORE MATRIX
// ⚠️ Check backend
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
  if (!res) return null;
  return res;
};

//
// =========================================================
// 11. STRATEGIE PER SETUP
// =========================================================
export const fetchStrategyBySetup = async (setupId, type = null) => {
  const url = `/api/strategies/by_setup/${setupId}${
    type ? `?type=${type}` : ''
  }`;

  const res = await fetchAuth(url, { method: 'GET' });
  if (!res || res?.exists === false) return null;
  return res.strategy ?? null;
};

//
// =========================================================
// 12. CELERY TASK STATUS
// =========================================================
export const fetchTaskStatus = async (taskId) =>
  await fetchAuth(`/api/tasks/${taskId}`, {
    method: 'GET',
  });

//
// =========================================================
// 13. 🧠 AI-ANALYSE VAN STRATEGIE
// =========================================================
export const analyzeStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/analyze/${strategyId}`, {
    method: 'POST',
  });

// =========================================================
// 14. 🎯 ACTIEVE STRATEGIE VANDAAG
// =========================================================
export const fetchActiveStrategyToday = async () => {
  const res = await fetchAuth(`/api/strategies/active-today`, {
    method: 'GET',
  });

  if (!res || res?.active === false) return null;

  return res.strategy;
};


// =========================================================
// 15. ⭐ FAVORITE TOGGLE
// =========================================================
export const toggleFavoriteStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/${strategyId}/favorite`, {
    method: 'PATCH',
  });

// =========================================================
// 16. 🧠 EXECUTION CURVES OPHALEN
// =========================================================
export const fetchExecutionCurves = async () =>
  await fetchAuth(`/api/curves/execution`, {
    method: 'GET',
  });
