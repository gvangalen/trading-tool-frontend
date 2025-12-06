'use client';

import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';   // ✅ Macro vereist AUTH
import { API_BASE_URL } from '@/lib/config';

//
// =======================================================
// 📊 1. Basis macrodata (USER-SPECIFIC → fetchWithAuth)
// =======================================================
//

// 📌 Alle macrodata (laatste snapshot per indicator)
export const fetchMacroData = async () => {
  return await fetchWithAuth(`/api/macro_data`, 'GET');
};

// 📌 Per periode
export const fetchMacroDataByDay = () =>
  fetchWithAuth(`/api/macro_data/day`, 'GET');

export const fetchMacroDataByWeek = () =>
  fetchWithAuth(`/api/macro_data/week`, 'GET');

export const fetchMacroDataByMonth = () =>
  fetchWithAuth(`/api/macro_data/month`, 'GET');

export const fetchMacroDataByQuarter = () =>
  fetchWithAuth(`/api/macro_data/quarter`, 'GET');


//
// =======================================================
// ➕ 2. Indicatorbeheer (user-specific → AUTH!)
// =======================================================
//

// ➕ Indicator toevoegen
export const addMacroIndicator = async (name) => {
  return await fetchWithAuth(`/api/macro_data`, 'POST', { name });
};

// 🗑 Indicator verwijderen
export const deleteMacroIndicator = async (name) => {
  return await fetchWithAuth(`/api/macro_data/${name}`, 'DELETE');
};


//
// =======================================================
// 🧠 3. Scorelogica & configuratie (user-specific)
// =======================================================
//

// 📋 Namen van beschikbare macro-indicatoren
export const getMacroIndicatorNames = async () => {
  return await fetchWithAuth(`/api/macro/indicators`, 'GET');
};

// 📊 Scoreregels voor een indicator
export const getScoreRulesForMacroIndicator = async (indicatorName) => {
  if (!indicatorName) return [];
  return await fetchWithAuth(
    `/api/macro_indicator_rules/${indicatorName}`,
    'GET'
  );
};

// Alias voor consistentie met technicalDataAdd()
export const macroDataAdd = async (indicator) => {
  return await fetchWithAuth(`/api/macro_data`, 'POST', { name: indicator });
};
