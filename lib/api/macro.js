import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/*  
📤 Haal de meest recente macrodata op
- Voor dashboard en standaard macro-tabel
*/
export const fetchMacroData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data`, 'GET');

/*  
📆 Haal macrodata op per tijdsperiode
- Wordt gebruikt in tabellen met filtering: Dag, Week, Maand, Kwartaal
*/
export const fetchMacroDataByDay = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/day`, 'GET');

export const fetchMacroDataByWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/week`, 'GET');

export const fetchMacroDataByMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/month`, 'GET');

export const fetchMacroDataByQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/macro_data/quarter`, 'GET');

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
