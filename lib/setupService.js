import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'react-hot-toast';

/*  
🔁 1. Alle setups ophalen
*/
export const fetchSetups = async () => {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/setups`, 'GET');
  } catch (error) {
    console.error('❌ [fetchSetups] Fout bij ophalen setups:', error);
    toast.error('Fout bij laden setups.');
    return [];
  }
};

/*  
🏆 2. Top N setups ophalen
*/
export const fetchTopSetups = async (limit = 3) => {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/setups/top?limit=${limit}`, 'GET');
  } catch (error) {
    console.error('❌ [fetchTopSetups] Fout bij ophalen top setups:', error);
    toast.error('Top setups laden mislukt.');
    return [];
  }
};

/*  
✏️ 3. Setup bijwerken
*/
export const updateSetup = async (id, updatedData) => {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/setups/${id}`, 'PATCH', updatedData);
    toast.success('Setup bijgewerkt!');
    return response;
  } catch (error) {
    console.error(`❌ [updateSetup] Setup ID ${id} bijwerken mislukt:`, error);
    toast.error('Bijwerken mislukt.');
    throw error;
  }
};

/*  
🗑️ 4. Setup verwijderen
*/
export const deleteSetup = async (id) => {
  try {
    await fetchWithRetry(`${API_BASE_URL}/setups/${id}`, 'DELETE');
    toast.success('Setup verwijderd!');
  } catch (error) {
    console.error(`❌ [deleteSetup] Verwijderen setup ID ${id} mislukt:`, error);
    toast.error('Verwijderen mislukt.');
    throw error;
  }
};

/*  
➕ 5. Setup toevoegen
*/
export const addSetup = async (newData) => {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/setups`, 'POST', newData);
    toast.success('Nieuwe setup toegevoegd!');
    return response;
  } catch (error) {
    console.error('❌ [addSetup] Setup toevoegen mislukt:', error);
    toast.error('Toevoegen mislukt.');
    throw error;
  }
};
