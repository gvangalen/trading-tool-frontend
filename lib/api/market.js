'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// ===============================
// 📌 MARKTDATA (Bestaande API's)
// ===============================
//

// 1. Haal laatste marktdata op (dashboard + tabellen)
export const fetchMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// 2. Handmatig market data refresh via CoinGecko
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/save`, 'POST');

// 3. Marktdata met interpretatie & score (adviescomponent)
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// 4. Test-API
export const testMarketAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/test`, 'GET');

// 5. Verwijder een markt asset
export const deleteMarketAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/${id}`, 'DELETE');

// 6. 7-daagse historische marktdata
export const fetchMarketData7d = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/7d`, 'GET');

// 7. Live BTC prijs
export const fetchLatestBTC = async () => {
  const res = await fetch(`${API_BASE_URL}/api/market_data/btc/latest`);
  if (!res.ok) throw new Error('Fout bij ophalen BTC prijs');
  return await res.json();
};

// 8a. Forward returns (week)
export const fetchForwardReturnsWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/week`, 'GET');

// 8b. Forward returns (maand)
export const fetchForwardReturnsMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/maand`, 'GET');

// 8c. Forward returns (kwartaal)
export const fetchForwardReturnsQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/kwartaal`, 'GET');

// 8d. Forward returns (jaar)
export const fetchForwardReturnsYear = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/jaar`, 'GET');


//
// ===============================
// 📌 MARKET SCORELOGY (NIEUWE API's)
// ===============================
//

// 👉 Haal lijst met alle beschikbare market indicators op
export const getMarketIndicatorNames = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicators/names`, 'GET');

// 👉 Haal scoreregels op voor een specifieke market indicator
export const getScoreRulesForMarketIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicator_rules/${name}`, 'GET');

// 👉 Voeg een indicator toe aan dagelijkse market analyse
export const marketDataAdd = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/add_indicator`, {
    method: 'POST',
    body: { indicator: name }
  });
