import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

// ✅ Haal alle macrodata op (voor dashboard en tabellen)
export const fetchMacroData = () =>
  fetchWithRetry('/api/macro_data', 'GET');

// ✅ Voeg een nieuwe macro-indicator toe
export const addMacroIndicator = (name) =>
  fetchWithRetry('/api/macro_data/add', 'POST', { name });

// ✅ Verwijder een macro-indicator
export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`/api/macro_data/${name}`, 'DELETE');
