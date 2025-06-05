// ✅ lib/api/macro.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal alle macrodata op
export const fetchMacroData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'GET');

// ✅ Voeg een nieuwe macro-indicator toe
export const addMacroIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/add`, 'POST', { name });

// ⚠️ Verwijderen bestaat (nog) niet in backend — deze moet je verwijderen of later toevoegen
// export const deleteMacroIndicator = (name) =>
//   fetchWithRetry(`${API_BASE_URL}/api/macro_data/${name}`, 'DELETE');
