'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

//
// ===============================
// 📌 MARKTDATA (Bestaande API's)
// ===============================
//

// 1. Recente marktdata (dashboard + grafieken)
export const fetchMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// 2. Handmatige market refresh
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data`, 'POST');

// 3. Interpretatie + score
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// 4. 7-daagse BTC data
export const fetchMarketData7d = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/7d`, 'GET');

// 5. Live BTC prijs
export const fetchLatestBTC = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/btc/latest`, 'GET');

// 6. Forward returns
export const fetchForwardReturnsWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/week`, 'GET');

export const fetchForwardReturnsMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/maand`, 'GET');

export const fetchForwardReturnsQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/kwartaal`, 'GET');

export const fetchForwardReturnsYear = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward/jaar`, 'GET');


//
// ===============================
// 📌 MARKET INDICATOR SYSTEM (Nieuwe API's)
// ===============================
//

// 1. Lijst met beschikbare indicators
export const getMarketIndicatorNames = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicator_names`, 'GET');

// 2. Scoreregels
export const getScoreRulesForMarketIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/indicator_rules/${name}`, 'GET');

// 3. Dagtabel market indicators (NIEUWE juiste route)
export const fetchMarketDayData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/day`, 'GET');

// 4. Indicator toevoegen
export const marketDataAdd = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/add_indicator`, 'POST', {
    indicator: name,
  });

// 5. Indicator verwijderen
export const marketDataDelete = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/market/delete_indicator/${name}`, 'DELETE');
