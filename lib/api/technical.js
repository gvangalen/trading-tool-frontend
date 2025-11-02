import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📥 1. Haal alle technische data op
export const technicalDataAll = async () => {
  console.log("📡 [technicalDataAll] Ophalen van /api/technical_data");
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');
  console.log("📥 [technicalDataAll] Gegevens ontvangen:", data);
  return data;
};

// ➕ 2. Voeg handmatig nieuwe technische data toe
export const technicalDataAdd = async (symbol, rsi, volume, ma_200, timeframe = '1D') => {
  console.log(`➕ [technicalDataAdd] Toevoegen van ${symbol}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    timeframe,
  });
  console.log("✅ [technicalDataAdd] Response:", data);
  return data;
};

// 🗑️ 3. Verwijder technische data op basis van ID
export const technicalDataDelete = async (symbol) => {
  console.log(`🗑️ [technicalDataDelete] Verwijderen van ${symbol}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'DELETE');
  console.log("✅ [technicalDataDelete] Response:", data);
  return data;
};

// ✅ Alias voor consistent gebruik in hooks
export const deleteTechnicalIndicator = technicalDataDelete;

// 🔍 4. Filter technische data op asset
export const technicalDataBySymbol = async (symbol) => {
  console.log(`🔍 [technicalDataBySymbol] Ophalen van ${symbol}`);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'GET');
  console.log("📥 [technicalDataBySymbol] Response:", data);
  return data;
};

// 📊 5. Technische samenvattingen per periode
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
// 🧠 ➕ RULES VOOR SCORELOGICA
//

// 📥 Haal alle bestaande regels op uit backend
export const getAllRules = async () => {
  console.log('📡 [getAllRules] Ophalen van /api/technical_indicator_rules');
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_indicator_rules`, 'GET');
  console.log('📥 [getAllRules] Regels ontvangen:', data);
  return data;
};

// ➕ Voeg een nieuwe regel toe
export const addNewRule = async (rule) => {
  console.log('➕ [addNewRule] Versturen van regel naar backend:', rule);
  const data = await fetchWithRetry(`${API_BASE_URL}/api/technical_indicator_rules`, 'POST', rule);
  console.log('✅ [addNewRule] Response:', data);
  return data;
};
