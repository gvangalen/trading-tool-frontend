'use client';

import { fetchAuth } from '@/lib/auth/apiClient';
import { API_BASE_URL } from '@/lib/config';

//
// =============================================================
// 📥 1. Alle technische data ophalen (user-specific)
// =============================================================
export const technicalDataAll = async () => {
  console.log("📡 [technicalDataAll] GET /api/technical_data");
  const data = await fetchWithAuth(`/api/technical_data`, 'GET');
  return data || [];
};


//
// =============================================================
// ➕ 2. Technische indicator toevoegen (user-specific)
// =============================================================
export const technicalDataAdd = async (indicator) => {
  console.log(`➕ [technicalDataAdd] Indicator toevoegen: ${indicator}`);

  const payload = {
    indicator,
    value: 0.0,        // nooit null
    score: 0,
    advies: null,
    uitleg: null,
  };

  return await fetchWithAuth(`/api/technical_data`, 'POST', payload);
};


//
// =============================================================
// 🗑️ 3. Eén technische indicator verwijderen
// =============================================================
export const technicalDataDelete = async (indicator) => {
  console.log(`🗑️ [technicalDataDelete] DELETE /api/technical_data/${indicator}`);
  return await fetchWithAuth(`/api/technical_data/${indicator}`, 'DELETE');
};

// alias
export const deleteTechnicalIndicator = technicalDataDelete;


//
// =============================================================
// 📆 4. Periodieke data (day / week / month / quarter)
// =============================================================
export const technicalDataDay = async () =>
  await fetchWithAuth(`/api/technical_data/day`, 'GET');

export const technicalDataWeek = async () =>
  await fetchWithAuth(`/api/technical_data/week`, 'GET');

export const technicalDataMonth = async () =>
  await fetchWithAuth(`/api/technical_data/month`, 'GET');

export const technicalDataQuarter = async () =>
  await fetchWithAuth(`/api/technical_data/quarter`, 'GET');


//
// =============================================================
// 🧠 5. Scorelogica + configuratie (user-specific)
// =============================================================

// Beschikbare technische indicatornamen
export const getIndicatorNames = async () =>
  await fetchWithAuth(`/api/technical/indicators`, 'GET');

// Scoreregels voor één indicator
export const getScoreRulesForIndicator = async (indicatorName) =>
  await fetchWithAuth(`/api/technical_indicator_rules/${indicatorName}`, 'GET');
