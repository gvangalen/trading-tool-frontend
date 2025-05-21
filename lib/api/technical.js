import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

// ✅ Haal alle technische indicatoren op
export const fetchTechnicalData = () =>
  fetchWithRetry('/api/technical_data', 'GET');

// ✅ Asset toevoegen aan technische tabel
export const addTechnicalAsset = (symbol, timeframe) =>
  fetchWithRetry('/api/technical_data/add', 'POST', { symbol, timeframe });

// ✅ Asset verwijderen uit technische tabel
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');

// (optioneel) ✅ Specifieke asset ophalen
export const fetchTechnicalDataForAsset = (symbol, timeframe) =>
  fetchWithRetry(`/api/technical_data/${symbol}/${timeframe}`, 'GET');
