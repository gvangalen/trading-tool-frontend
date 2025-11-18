import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// 📥 1. Haal alle technische data op
//
export const technicalDataAll = async () => {
  console.log("📡 [technicalDataAll] Ophalen van /api/technical_data");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');
  return data || [];
};

//
// ➕ 2. Voeg nieuwe technische indicator toe
//
export const technicalDataAdd = async (indicator) => {
  console.log(`➕ [technicalDataAdd] Indicator toevoegen: ${indicator}`);

  const payload = {
    indicator,
    value: 0.0,                         // nooit meer null
    score: 0,
    advies: null,
    uitleg: null,
    timestamp: new Date().toISOString()
  };

  const data = await fetchWithRetry(
    `${API_BASE_URL}/api/technical_data`,
    'POST',
    payload
  );

  return data;
};

//
// 🗑️ 3. Verwijder één specifieke technische indicator
//
export const technicalDataDelete = async (indicator) => {
  console.log(`🗑️ [technicalDataDelete] Verwijderen van indicator: ${indicator}`);
  const data = await fetchWithRetry(
    `${API_BASE_URL}/api/technical_data/${indicator}`,
    'DELETE'
  );
  return data;
};

// Alias voor consistentie in frontend
export const deleteTechnicalIndicator = technicalDataDelete;

//
// 📆 Periodieke data
//
export const technicalDataDay = async () => {
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/day`, 'GET');
  return data || [];
};

export const technicalDataWeek = async () => {
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/week`, 'GET');
  return data || [];
};

export const technicalDataMonth = async () => {
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/month`, 'GET');
  return data || [];
};

export const technicalDataQuarter = async () => {
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/quarter`, 'GET');
  return data || [];
};

//
// 🧠 SCORELOGICA
//
export const getIndicatorNames = async () => {
  const data = await fetchWithRetry(
    `${API_BASE_URL}/api/technical/indicators`,
    'GET'
  );
  return data || [];
};

export const getScoreRulesForIndicator = async (indicatorName) => {
  const data = await fetchWithRetry(
    `${API_BASE_URL}/api/technical_indicator_rules/${indicatorName}`,
    'GET'
  );
  return data || [];
};
