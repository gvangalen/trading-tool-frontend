import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';

// ✅ Haal alle technische indicatoren op
export const fetchTechnicalData = () =>
  fetchWithRetry('/api/technical_data', 'GET');

// ✅ Voeg een nieuwe asset toe aan technische tabel
export const addTechnicalAsset = (symbol, timeframe) =>
  fetchWithRetry('/api/technical_data/add', 'POST', { symbol, timeframe });

// ✅ Verwijder een asset uit de technische tabel
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');

// ✅ Optioneel: Haal data op voor specifieke asset + timeframe
export const fetchTechnicalDataForAsset = (symbol, timeframe) =>
  fetchWithRetry(`/api/technical_data/${symbol}/${timeframe}`, 'GET');
