'use client';

import { fetchAuth } from '@/lib/api/auth';  // ✅ JUISTE AUTH
import { toast } from 'react-hot-toast';

//
// =========================================================
// 1. ALLE SETUPS OPHALEN (met filters)
// =========================================================
export const fetchSetups = async (strategyType = '', excludeStrategyTypes = []) => {
  try {
    const query = new URLSearchParams();

    if (strategyType) query.append('strategy_type', strategyType);
    if (excludeStrategyTypes.length > 0) {
      query.append('exclude_strategy_types', excludeStrategyTypes.join(','));
    }

    const url = `/api/setups${query.toString() ? `?${query.toString()}` : ''}`;

    const result = await fetchAuth(url, { method: 'GET' });
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('❌ [fetchSetups] Fout:', err);
    toast.error('Setups laden mislukt.');
    return [];
  }
};

//
// =========================================================
// 2. DCA SETUPS
// =========================================================
export const fetchDcaSetups = async () => {
  try {
    const result = await fetchAuth(`/api/setups/dca`, { method: 'GET' });
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('❌ [fetchDcaSetups] Fout:', err);
    toast.error('DCA setups laden mislukt.');
    return [];
  }
};

//
// =========================================================
// 3. TOP SETUPS
// =========================================================
export const fetchTopSetups = async (limit = 3) => {
  let safe = parseInt(limit);
  if (isNaN(safe) || safe < 1) safe = 3;
  if (safe > 100) safe = 100;

  try {
    const result = await fetchAuth(`/api/setups/top?limit=${safe}`, { method: 'GET' });
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('❌ [fetchTopSetups] Fout:', err);
    toast.error('Top setups laden mislukt.');
    return [];
  }
};

//
// =========================================================
// 4. SETUP UPDATEN
// =========================================================
export const updateSetup = async (id, updatedData) => {
  try {
    const res = await fetchAuth(`/api/setups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedData),
    });

    toast.success('Setup bijgewerkt!');
    return res;
  } catch (err) {
    console.error('❌ [updateSetup] Fout:', err);
    toast.error('Bijwerken mislukt.');
    throw err;
  }
};

//
// =========================================================
// 5. SETUP VERWIJDEREN
// =========================================================
export const deleteSetup = async (id) => {
  try {
    await fetchAuth(`/api/setups/${id}`, {
      method: 'DELETE',
    });

    toast.success('Setup verwijderd!');
  } catch (err) {
    console.error('❌ [deleteSetup] Fout:', err);
    toast.error('Verwijderen mislukt.');
    throw err;
  }
};

//
// =========================================================
// 6. NIEUWE SETUP OPSLAAN
// =========================================================
export const saveNewSetup = async (newData) => {
  try {
    const res = await fetchAuth(`/api/setups`, {
      method: 'POST',
      body: JSON.stringify(newData),
    });

    toast.success('Nieuwe setup toegevoegd!');
    return res;
  } catch (err) {
    console.error('❌ [saveNewSetup] Fout:', err);
    toast.error('Toevoegen mislukt.');
    throw err;
  }
};

//
// =========================================================
// 7. AI-UITLEG GENEREREN
// =========================================================
export const generateExplanation = async (setupId, reload = null) => {
  try {
    const res = await fetchAuth(`/api/setups/explanation/${setupId}`, {
      method: 'POST',
    });

    if (reload) await reload();
    return res;
  } catch (err) {
    console.error('❌ [generateExplanation] Fout:', err);
    toast.error('AI-uitleg genereren mislukt.');
    return { explanation: '' };
  }
};

//
// =========================================================
// 8. CHECK OF NAAM BESTAAT
// =========================================================
export const checkSetupNameExists = async (name) => {
  try {
    const res = await fetchAuth(
      `/api/setups/check_name/${encodeURIComponent(name)}`,
      { method: 'GET' }
    );
    return res?.exists === true;
  } catch {
    return false;
  }
};

//
// =========================================================
// 9. LAATSTE SETUP
// =========================================================
export const fetchLastSetup = async () => {
  try {
    const res = await fetchAuth(`/api/setups/last`, { method: 'GET' });
    return res?.setup ?? null;
  } catch {
    return null;
  }
};

//
// =========================================================
// 10. ACTIEVE SETUP
// =========================================================
export const fetchActiveSetup = async () => {
  try {
    const res = await fetchAuth(`/api/setups/active`, { method: 'GET' });
    return res?.active ?? null;
  } catch (err) {
    console.error('❌ [fetchActiveSetup] Fout:', err);
    toast.error('Actieve setup laden mislukt.');
    return null;
  }
};
