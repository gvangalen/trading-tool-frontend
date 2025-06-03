import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal alle market data op (voor dashboard tabel)
export const fetchMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data`, 'GET');

// ✅ Haal individuele asset data op (optioneel)
export const fetchMarketDataForAsset = (symbol) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/${symbol}`, 'GET');

// ✅ Voeg een asset toe aan market data (optioneel)
export const addMarketAsset = (symbol) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/add`, 'POST', { symbol });

// ✅ Verwijder een asset uit de lijst (optioneel)
export const deleteMarketAsset = (symbol) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/${symbol}`, 'DELETE');
