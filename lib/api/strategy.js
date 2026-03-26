'use client';

import { fetchAuth } from '@/lib/api/auth';

//
// =========================================================
// 1. NIEUWE STRATEGIE AANMAKEN (FIXED)
// =========================================================
export const createStrategy = async (strategyData) => {
  console.log('🚀 Strategie verzenden naar backend:', strategyData);

  if (!strategyData?.setup_id) {
    throw new Error('setup_id is verplicht.');
  }

  if (!strategyData?.base_amount || Number(strategyData.base_amount) <= 0) {
    throw new Error('base_amount moet groter dan 0 zijn.');
  }

  if (!strategyData?.execution_mode) {
    throw new Error('execution_mode ontbreekt.');
  }

  // ---------------------------------------------------------
  // 🔥 CURVE VALIDATIE (blijft hetzelfde idee)
  // ---------------------------------------------------------
  if (
    strategyData.execution_mode !== 'fixed' &&
    !strategyData.decision_curve
  ) {
    throw new Error(
      'decision_curve is verplicht bij execution_mode ≠ fixed.'
    );
  }

  // ---------------------------------------------------------
  // 🔥 NIEUW: VALIDATIE OP SETUP TYPE (i.p.v strategy_type)
  // ---------------------------------------------------------
  const setupType = String(strategyData.setup_type || '').toLowerCase();

  if (setupType === 'breakout') {
    const required = ['entry', 'targets', 'stop_loss'];

    for (const field of required) {
      if (
        strategyData[field] === undefined ||
        strategyData[field] === null ||
        strategyData[field] === '' ||
        (Array.isArray(strategyData[field]) &&
          strategyData[field].length === 0)
      ) {
        throw new Error(`Veld "${field}" is verplicht voor breakout.`);
      }
    }
  }

  // ---------------------------------------------------------
  // ⚠️ BELANGRIJK: strategy_type behouden voor backend compat
  // ---------------------------------------------------------
  const payload = {
    ...strategyData,
    name: strategyData.name || undefined,

    // 🔥 fallback voor oude backend
    strategy_type: strategyData.strategy_type || 'auto',
  };

  return await fetchAuth(`/api/strategies`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

//
// =========================================================
// 2. STRATEGIEËN OPHALEN (ONGEWIJZIGD)
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
// 3. STRATEGIE UPDATEN (ONGEWIJZIGD)
// =========================================================
export const updateStrategy = async (id, data) => {
  const payload = {
    ...data,
    name: data.name || undefined,
  };

  return await fetchAuth(`/api/strategies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

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
// 9. EXPORT
// =========================================================
export const exportStrategiesCSV = async () =>
  await fetchAuth(`/api/strategies/export`, {
    method: 'GET',
  });

//
// =========================================================
// 10. LAATSTE STRATEGIE
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
// 12. TASK STATUS
// =========================================================
export const fetchTaskStatus = async (taskId) =>
  await fetchAuth(`/api/tasks/${taskId}`, {
    method: 'GET',
  });

//
// =========================================================
// 13. AI ANALYSE
// =========================================================
export const analyzeStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/analyze/${strategyId}`, {
    method: 'POST',
  });

//
// =========================================================
// 14. ACTIVE TODAY
// =========================================================
export const fetchActiveStrategyToday = async () => {
  const res = await fetchAuth(`/api/strategies/active-today`, {
    method: 'GET',
  });

  if (!res || res?.active === false) return null;

  return res.strategy;
};

//
// =========================================================
// 15. FAVORITE
// =========================================================
export const toggleFavoriteStrategy = async (strategyId) =>
  await fetchAuth(`/api/strategies/${strategyId}/favorite`, {
    method: 'PATCH',
  });

//
// =========================================================
// 16. CURVES
// =========================================================
export const fetchExecutionCurves = async () =>
  await fetchAuth(`/api/curves/execution`, {
    method: 'GET',
  });
