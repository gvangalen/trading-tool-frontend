import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'react-hot-toast';

/*  
🔁 1. Alle setups ophalen met optionele strategy_type filter (generieke route)
*/
export const fetchSetups = async (strategyType = '') => {
  try {
    let url = `${API_BASE_URL}/api/setups`;
    if (strategyType) {
      url += `?strategy_type=${encodeURIComponent(strategyType)}`;
    }
    console.log(`🔍 [fetchSetups] Request starten naar: ${url}`);

    const response = await fetch(url);
    console.log(`🔍 [fetchSetups] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchSetups] Server gaf fout: ${response.status} - ${errorText}`);
      toast.error(`Fout bij laden setups: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchSetups] Ontvangen data:', result);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.warn('⚠️ [fetchSetups] Lege dataset ontvangen voor setups.');
    }

    return result;
  } catch (error) {
    console.error('❌ [fetchSetups] Fout bij ophalen setups:', error);
    toast.error('Fout bij laden setups.');
    return [];
  }
};

/*  
🔁 2. DCA setups ophalen via speciale backend-route
*/
export const fetchDcaSetups = async () => {
  try {
    const url = `${API_BASE_URL}/api/setups/dca`;
    console.log(`🔍 [fetchDcaSetups] Request starten naar: ${url}`);

    const response = await fetch(url, { method: 'GET' }); 
    console.log(`🔍 [fetchDcaSetups] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchDcaSetups] Server gaf fout: ${response.status} - ${errorText}`);
      toast.error(`Fout bij laden DCA setups: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchDcaSetups] Ontvangen data:', result);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.warn('⚠️ [fetchDcaSetups] Lege dataset ontvangen voor DCA setups.');
    }

    return result;
  } catch (error) {
    console.error('❌ [fetchDcaSetups] Fout bij ophalen DCA setups:', error);
    toast.error('Fout bij laden DCA setups.');
    return [];
  }
};

/*  
🏆 3. Top N setups ophalen
*/
export const fetchTopSetups = async (limit = 3) => {
  try {
    const url = `${API_BASE_URL}/api/setups/top?limit=${limit}`;
    console.log(`🔍 [fetchTopSetups] Request starten naar: ${url}`);

    const response = await fetch(url);
    console.log(`🔍 [fetchTopSetups] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchTopSetups] Server gaf fout: ${response.status} - ${errorText}`);
      toast.error(`Fout bij laden top setups: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchTopSetups] Ontvangen data:', result);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.warn('⚠️ [fetchTopSetups] Lege dataset ontvangen voor top setups.');
    }

    return result;
  } catch (error) {
    console.error('❌ [fetchTopSetups] Fout bij ophalen top setups:', error);
    toast.error('Top setups laden mislukt.');
    return [];
  }
};

/*  
✏️ 4. Setup bijwerken
*/
export const updateSetup = async (id, updatedData) => {
  try {
    const url = `${API_BASE_URL}/api/setups/${id}`;
    console.log(`🔍 [updateSetup] PATCH request naar: ${url} met data:`, updatedData);

    const response = await fetchWithRetry(url, 'PATCH', updatedData);
    toast.success('Setup bijgewerkt!');
    return response;
  } catch (error) {
    console.error(`❌ [updateSetup] Setup ID ${id} bijwerken mislukt:`, error);
    toast.error('Bijwerken mislukt.');
    throw error;
  }
};

/*  
🗑️ 5. Setup verwijderen
*/
export const deleteSetup = async (id) => {
  try {
    const url = `${API_BASE_URL}/api/setups/${id}`;
    console.log(`🔍 [deleteSetup] DELETE request naar: ${url}`);

    await fetchWithRetry(url, 'DELETE');
    toast.success('Setup verwijderd!');
  } catch (error) {
    console.error(`❌ [deleteSetup] Verwijderen setup ID ${id} mislukt:`, error);
    toast.error('Verwijderen mislukt.');
    throw error;
  }
};

/*  
➕ 6. Setup toevoegen
*/
export const addSetup = async (newData) => {
  try {
    const url = `${API_BASE_URL}/api/setups`;
    console.log(`🔍 [addSetup] POST request naar: ${url} met data:`, newData);

    const response = await fetchWithRetry(url, 'POST', newData);
    toast.success('Nieuwe setup toegevoegd!');
    return response;
  } catch (error) {
    console.error('❌ [addSetup] Setup toevoegen mislukt:', error);
    toast.error('Toevoegen mislukt.');
    throw error;
  }
};

/*  
🧠 7. AI-uitleg genereren per setup
*/
export const generateExplanation = async (setupId, reloadSetups = null) => {
  try {
    const url = `${API_BASE_URL}/api/setups/explanation/${setupId}`;
    console.log(`🔍 [generateExplanation] POST request naar: ${url}`);

    const response = await fetchWithRetry(url, 'POST');
    if (reloadSetups) await reloadSetups(); // ⬅️ forceer refresh
    return response;
  } catch (error) {
    console.error('❌ [generateExplanation] Fout bij genereren uitleg:', error);
    toast.error('AI-uitleg genereren mislukt.');
    return { explanation: '' };
  }
};

/*  
🔍 8. Check of setupnaam al bestaat voor symbool (correcte endpoint!)
*/
export const checkSetupNameExists = async (name) => {
  try {
    const url = `${API_BASE_URL}/api/setups/check_name/${encodeURIComponent(name)}`;
    console.log(`🔍 [checkSetupNameExists] GET request naar: ${url}`);

    const res = await fetchWithRetry(url, 'GET');
    return res.exists === true;
  } catch (error) {
    console.error('❌ [checkSetupNameExists] Naamcontrole mislukt:', error);
    return false;
  }
};
