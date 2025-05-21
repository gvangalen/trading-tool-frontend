import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 🔁 Setup lijst ophalen
export const fetchSetups = () =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`);

// 🏆 Top N setups ophalen
export const fetchTopSetups = (limit = 3) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/top?limit=${limit}`);

// ✏️ Setup bijwerken (PUT)
export const updateSetup = (id, updatedData) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/${id}`, 'PUT', updatedData);

// 🗑️ Setup verwijderen (DELETE)
export const deleteSetup = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups/${id}`, 'DELETE');

// ➕ Nieuwe setup toevoegen (POST)
export const addSetup = (newData) =>
  fetchWithRetry(`${API_BASE_URL}/api/setups`, 'POST', newData);
