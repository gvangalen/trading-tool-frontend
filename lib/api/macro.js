// frontend/lib/api/macro.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/*  
📤 Haal alle macrodata op
- Voor dashboard en macro-tabel
*/
export const fetchMacroData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'GET');

/*  
➕ Voeg een nieuwe macro-indicator toe
- Alleen naam nodig; backend haalt waarde en score op via config
*/
export const addMacroIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'POST', { name });

/*  
🗑️ Verwijder macro-indicator op basis van naam
- Alleen mogelijk als backend deze functie ondersteunt
*/
export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/${name}`, 'DELETE');
