import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// 📊 1. Basis macrodata
//

/*  
📤 Haal de meest recente macrodata op
- Voor dashboard en standaard macro-tabel
*/
export const fetchMacroData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'GET');

/*  
📆 Haal macrodata op per tijdsperiode
- Wordt gebruikt in tabellen met filtering: Dag, Week, Maand, Kwartaal
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

/*  
➕ Voeg een nieuwe macro-indicator toe
- Alleen naam nodig; backend haalt waarde en score op via config
*/
export const addMacroIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'POST', { name });

/*  
🗑️ Verwijder macro-indicator op basis van naam
- Alleen mogelijk als backend deze functie ondersteunt
*/
export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/${name}`, 'DELETE');

//
// 🧠 3. Scorelogica & configuratie
//

/*  
📋 Haal alle beschikbare macro-indicatornamen op
- Wordt gebruikt in dropdowns of zoekvelden (MacroIndicatorScoreView)
*/
export const getMacroIndicatorNames = async () => {
  console.log('📡 [getMacroIndicatorNames] Ophalen van /api/macro/indicators');
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro/indicators`, 'GET');
  console.log('📥 [getMacroIndicatorNames] Gegevens ontvangen:', data);
  return data;
};

/*  
📊 Haal scoreregels op voor één specifieke macro-indicator
- Toont range, score, trend, interpretatie, actie
*/
export const getScoreRulesForMacroIndicator = async (indicatorName) => {
  console.log(`📡 [getScoreRulesForMacroIndicator] Ophalen van regels voor ${indicatorName}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_indicator_rules/${indicatorName}`, 'GET');
  console.log('📥 [getScoreRulesForMacroIndicator] Regels ontvangen:', data);
  return data;
};

/*  
➕ Voeg een macro-indicator toe via ScoreView
- Alias zodat frontend dezelfde naam kan gebruiken als technicalDataAdd()
*/
export const macroDataAdd = async (indicator) => {
  console.log(`➕ [macroDataAdd] Indicator toevoegen: ${indicator}`);
  const payload = { indicator };
  const data = await fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'POST', payload);
  console.log("✅ [macroDataAdd] Response ontvangen:", data);
  return data;
};
