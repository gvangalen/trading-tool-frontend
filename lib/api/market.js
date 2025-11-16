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
  fetchWithRetry(`${API_BASE_URL}/api/market_data`, 'POST');

// 3. Marktdata met interpretatie & score
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// 4. Verwijder een markt asset
export const deleteMarketAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/${id}`, 'DELETE');

// 5. 7-daagse historische marktdata
export const fetchMarketData7d = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/7d`, 'GET');

// 6. Live BTC prijs
export const fetchLatestBTC = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/btc/latest`, 'GET');

// 7a. Forward returns (week)
export const fetchForwardReturnsWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/week`, 'GET');

// 7b. Forward returns (maand)
export const fetchForwardReturnsMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/maand`, 'GET');

// 7c. Forward returns (kwartaal)
export const fetchForwardReturnsQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/kwartaal`, 'GET');

// 7d. Forward returns (jaar)
export const fetchForwardReturnsYear = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/jaar`, 'GET');

//
// ===============================
// 📌 MARKET SCORELOGY (Nieuwe API's)
// ===============================
//

// 👉 1. Haal lijst met alle beschikbare market indicators op
export const getMarketIndicatorNames = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicator_names`, 'GET');

// 👉 2. Haal scoreregels op voor één specifieke indicator
export const getScoreRulesForMarketIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicator_rules/${name}`, 'GET');

// 👉 3. Haal actieve daily indicators op (dagtabel)
export const fetchActiveMarketIndicators = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market/active_indicators`, 'GET');

// 👉 4. Voeg indicator toe aan dagelijkse analyse
export const marketDataAdd = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/add_indicator`, 'POST', {
    indicator: name,
  });

// 👉 5. Verwijder indicator uit dagelijkse analyse
export const marketDataDelete = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/delete_indicator/${name}`, 'DELETE');
