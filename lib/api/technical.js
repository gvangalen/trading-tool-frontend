import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// 📊 TECHNICAL DATA API
//

// 📥 1. Haal alle technische data op
export const technicalDataAll = async () => {
  console.log("📡 [technicalDataAll] Ophalen van /api/technical_data");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');
  console.log("📥 [technicalDataAll] Gegevens ontvangen:", data);
  return data;
};

// ➕ 2. Voeg nieuwe technische indicator toe (NIEUWE OPZET)
export const technicalDataAdd = async ({ symbol, indicator, value = null, timeframe = 'day', timestamp = null }) => {
  console.log(`➕ [technicalDataAdd] Toevoegen van indicator: ${indicator} voor ${symbol}`);

  // ✅ Dynamische payload – werkt voor elke indicatornaam
  const payload = {
    symbol,
    indicator,
    value,
    timeframe,
    timestamp: timestamp || new Date().toISOString(),
  };

  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'POST', payload);
  console.log("✅ [technicalDataAdd] Response ontvangen:", data);
  return data;
};

// 🗑️ 3. Verwijder technische data op basis van symbool
export const technicalDataDelete = async (symbol) => {
  console.log(`🗑️ [technicalDataDelete] Verwijderen van ${symbol}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'DELETE');
  console.log("✅ [technicalDataDelete] Response:", data);
  return data;
};

// ✅ Alias voor consistent gebruik
export const deleteTechnicalIndicator = technicalDataDelete;

// 🔍 4. Filter technische data op asset
export const technicalDataBySymbol = async (symbol) => {
  console.log(`🔍 [technicalDataBySymbol] Ophalen van ${symbol}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'GET');
  console.log("📥 [technicalDataBySymbol] Response:", data);
  return data;
};

//
// 📆 PERIODIEKE DATA
//

export const technicalDataDay = async () => {
  console.log("📊 [technicalDataDay] Ophalen van /day");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/day`, 'GET');
  console.log("📥 [technicalDataDay] Data ontvangen:", data);
  return data;
};

export const technicalDataWeek = async () => {
  console.log("📊 [technicalDataWeek] Ophalen van /week");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/week`, 'GET');
  console.log("📥 [technicalDataWeek] Data ontvangen:", data);
  return data;
};

export const technicalDataMonth = async () => {
  console.log("📊 [technicalDataMonth] Ophalen van /month");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/month`, 'GET');
  console.log("📥 [technicalDataMonth] Data ontvangen:", data);
  return data;
};

export const technicalDataQuarter = async () => {
  console.log("📊 [technicalDataQuarter] Ophalen van /quarter");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/quarter`, 'GET');
  console.log("📥 [technicalDataQuarter] Data ontvangen:", data);
  return data;
};

//
// 🧠 SCORELOGICA
//

// 📡 Haal alle beschikbare indicatornamen op
export const getIndicatorNames = async () => {
  console.log('📡 [getIndicatorNames] Ophalen van /api/technical/indicators');
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical/indicators`, 'GET');
  console.log('📥 [getIndicatorNames] Gegevens ontvangen:', data);
  return data;
};

// 📡 Haal ALLE scoreregels op (frontend filtert zelf)
export const getScoreRulesForIndicator = async (indicatorName) => {
  console.log(`📡 [getScoreRulesForIndicator] Ophalen van regels voor ${indicatorName}`);
  const allRules = await fetchWithRetry(`${API_BASE_URL}/api/technical_indicator_rules`, 'GET');
  console.log('📥 [getScoreRulesForIndicator] Alle regels ontvangen:', allRules);

  // ✅ Filter alleen de regels voor de gekozen indicator
  const filtered = allRules.filter((r) => r.indicator === indicatorName);
  return filtered;
};
