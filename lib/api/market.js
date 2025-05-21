import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

// ✅ Haal alle market data op (voor dashboard tabel)
export const fetchMarketData = () =>
  fetchWithRetry('/api/market_data', 'GET');

// (optioneel) ✅ Voor toekomstige uitbreiding: individuele asset ophalen
export const fetchMarketDataForAsset = (symbol) =>
  fetchWithRetry(`/api/market_data/${symbol}`, 'GET');

// (optioneel) ✅ Voor toevoegen via frontend formulier
export const addMarketAsset = (symbol) =>
  fetchWithRetry('/api/market_data/add', 'POST', { symbol });

// (optioneel) ✅ Verwijder asset uit lijst
export const deleteMarketAsset = (symbol) =>
  fetchWithRetry(`/api/market_data/${symbol}`, 'DELETE');
