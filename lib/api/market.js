// ✅ lib/api/market.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ 1. Haal laatste marktdata op (voor dashboard + tabellen)
export const fetchMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/market_data/list`, 'GET');

// ✅ 2. Sla nieuwe marktdata op vanuit CoinGecko (handmatige update)
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/market_data/save`, 'POST');

// ✅ 3. Haal BTC-data op met interpretatie + score (voor adviescomponent)
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/market_data/interpreted`, 'GET');

// ✅ 4. Test-API (voor debugging of CI-checks)
export const testMarketAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/market_data/test`, 'GET');
