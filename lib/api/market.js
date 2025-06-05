// ✅ lib/api/market.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal laatste marktdata op (BTC & SOL) → voor dashboard en tabellen
export const fetchMarketDataList = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// ✅ Alias voor backward compatibility met oude code
export const fetchMarketData = fetchMarketDataList;

// ✅ Sla nieuwe marktdata op vanuit CoinGecko (handmatig via knop)
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/save`, 'POST');

// ✅ Haal geïnterpreteerde BTC-marktdata op (score + advies)
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// ✅ Test of de API bereikbaar is
export const testMarketAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/test`, 'GET');
