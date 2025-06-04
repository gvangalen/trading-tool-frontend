// ✅ lib/api/market.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal laatste marktdata op (BTC & SOL) → voor dashboard
export const fetchMarketDataList = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// ✅ Sla nieuwe marktdata op vanuit CoinGecko
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/save`, 'POST');

// ✅ Haal geïnterpreteerde BTC-marktdata op
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// ✅ Test of backend bereikbaar is
export const testMarketAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/test`, 'GET');
