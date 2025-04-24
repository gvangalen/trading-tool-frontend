// ✅ fetchWithRetry: Universele fetch met retries + foutafhandeling
export async function fetchWithRetry(url, method = 'GET', body = null, retries = 3, delay = 2000) {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        throw new Error('❌ Lege of ongeldige response');
      }

      return data;
    } catch (err) {
      console.warn(`⚠️ Poging ${attempts + 1} mislukt voor ${url}: ${err.message}`);
      attempts++;
      if (attempts === retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

//
// ✅ Macro-indicator acties
//
export const addMacroIndicator = (name) =>
  fetchWithRetry('/api/macro_data/add', 'POST', { name });

export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`/api/macro_data/${name}`, 'DELETE');

//
// ✅ Technische asset verwijderen
//
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');

//
// ✅ Setup acties
//
export const deleteSetup = (id) =>
  fetchWithRetry(`/api/setups/${id}`, 'DELETE');

export const createSetup = (setupData) =>
  fetchWithRetry('/api/setups', 'POST', setupData);

//
// 🧠 AI of extra acties (voor toekomstig gebruik)
//
/*
export const generateAIAdvice = (symbol) =>
  fetchWithRetry(`/api/trading_advice?symbol=${symbol}`);

export const updateSetup = (id, data) =>
  fetchWithRetry(`/api/setups/${id}`, 'PUT', data);
*/

// ✅ Dashboard data ophalen
export async function fetchMacroData() {
  const data = await fetchWithRetry('/api/dashboard_data');
  return data?.macro_data || [];
}

export async function fetchMarketData() {
  const data = await fetchWithRetry('/api/dashboard_data/market');
  return data || [];
}

export async function fetchTechnicalData() {
  const data = await fetchWithRetry('/api/dashboard_data');
  return data?.technical_data || [];
}
