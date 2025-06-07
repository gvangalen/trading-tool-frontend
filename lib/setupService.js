import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

/*  
🔁 1. Alle setups ophalen
- Voor tabellen, dropdowns, AI-verwerking
*/
export const fetchSetups = () =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`, 'GET');

/*  
🏆 2. Top N setups ophalen (default = 3)
- Voor dashboard highscore/visualisatie
*/
export const fetchTopSetups = (limit = 3) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/top?limit=${limit}`, 'GET');

/*  
✏️ 3. Setup bijwerken op basis van ID
*/
export const updateSetup = (id, updatedData) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/${id}`, 'PUT', updatedData);

/*  
🗑️ 4. Setup verwijderen op basis van ID
*/
export const deleteSetup = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/${id}`, 'DELETE');

/*  
➕ 5. Nieuwe setup toevoegen
*/
export const addSetup = (newData) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`, 'POST', newData);
