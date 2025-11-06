import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// 📊 1. Basis macrodata
//

/**
 * 📤 Haal de meest recente macrodata op
 * - Voor dashboard en standaard macro-tabel
 */
export const fetchMacroData = async () => {
  console.log('📡 [fetchMacroData] Ophalen van /api/macro_data');
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'GET');
  console.log('📥 [fetchMacroData] Gegevens ontvangen:', data);
  return data;
};

/**
 * 📆 Haal macrodata op per tijdsperiode
 * - Wordt gebruikt in tabellen met filtering: Dag, Week, Maand, Kwartaal
 */
export const fetchMacroDataByDay = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/day`, 'GET');

export const fetchMacroDataByWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/week`, 'GET');

export const fetchMacroDataByMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/month`, 'GET');

export const fetchMacroDataByQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/quarter`, 'GET');

//
// ➕ 2. Indicatorbeheer
//

/**
 * ➕ Voeg een nieuwe macro-indicator toe
 * - Alleen naam nodig; backend haalt waarde en score op via config
 */
export const addMacroIndicator = async (name) => {
  console.log(`➕ [addMacroIndicator] Toevoegen van macro-indicator: ${name}`);
  const payload = { name };
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'POST', payload);
  console.log('✅ [addMacroIndicator] Response ontvangen:', data);
  return data;
};

/**
 * 🗑️ Verwijder macro-indicator op basis van naam
 * - Backend: DELETE /api/macro_data/{name}
 */
export const deleteMacroIndicator = async (name) => {
  if (!name) {
    console.warn('⚠️ [deleteMacroIndicator] Geen naam opgegeven.');
    return;
  }
  console.log(`🗑️ [deleteMacroIndicator] Verwijderen van macro-indicator: ${name}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_data/${name}`, 'DELETE');
  console.log('✅ [deleteMacroIndicator] Response ontvangen:', data);
  return data;
};

//
// 🧠 3. Scorelogica & configuratie
//

/**
 * 📋 Haal alle beschikbare macro-indicatornamen op
 * - Voor dropdowns of zoekvelden in MacroIndicatorScoreView
 */
export const getMacroIndicatorNames = async () => {
  console.log('📡 [getMacroIndicatorNames] Ophalen van /api/macro/indicators');
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro/indicators`, 'GET');
  console.log('📥 [getMacroIndicatorNames] Gegevens ontvangen:', data);
  return data;
};

/**
 * 📊 Haal scoreregels op voor één specifieke macro-indicator
 * - Toont range, score, trend, interpretatie, actie
 */
export const getScoreRulesForMacroIndicator = async (indicatorName) => {
  if (!indicatorName) {
    console.warn('⚠️ [getScoreRulesForMacroIndicator] Geen indicatornaam opgegeven.');
    return [];
  }
  console.log(`📡 [getScoreRulesForMacroIndicator] Ophalen van regels voor ${indicatorName}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_indicator_rules/${indicatorName}`, 'GET');
  console.log('📥 [getScoreRulesForMacroIndicator] Regels ontvangen:', data);
  return data;
};

/**
 * ➕ Voeg een macro-indicator toe via ScoreView
 * - Alias zodat frontend dezelfde naam kan gebruiken als technicalDataAdd()
 */
export const macroDataAdd = async (indicator) => {
  console.log(`➕ [macroDataAdd] Indicator toevoegen: ${indicator}`);
  const payload = { name: indicator }; // ✅ backend verwacht 'name'
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'POST', payload);
  console.log('✅ [macroDataAdd] Response ontvangen:', data);
  return data;
};
