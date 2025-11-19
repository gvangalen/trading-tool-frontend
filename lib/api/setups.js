import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'react-hot-toast';

/*  
🔁 1. Alle setups ophalen met optionele filters
*/
export const fetchSetups = async (strategyType = '', excludeStrategyTypes = []) => {
  try {
    let url = `${API_BASE_URL}/api/setups`;
    const params = new URLSearchParams();

    if (strategyType) params.append('strategy_type', strategyType);
    if (excludeStrategyTypes.length > 0) {
      params.append('exclude_strategy_types', excludeStrategyTypes.join(','));
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }

    console.log(`🔍 [fetchSetups] Request naar: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchSetups] Fout: ${response.status} - ${errorText}`);
      toast.error(`Fout bij laden setups: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchSetups] Data:', result);
    return result;
  } catch (error) {
    console.error('❌ [fetchSetups] Fout:', error);
    toast.error('Fout bij laden setups.');
    return [];
  }
};

/*  
🔁 2. DCA setups ophalen
*/
export const fetchDcaSetups = async () => {
  try {
    const url = `${API_BASE_URL}/api/setups/dca`;
    console.log(`🔍 [fetchDcaSetups] Request naar: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchDcaSetups] Fout: ${response.status} - ${errorText}`);
      toast.error(`DCA setups laden mislukt.`);
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchDcaSetups] Data:', result);
    return result;
  } catch (error) {
    console.error('❌ [fetchDcaSetups] Fout:', error);
    toast.error('Fout bij laden DCA setups.');
    return [];
  }
};

/*  
🏆 3. Top setups ophalen
*/
export const fetchTopSetups = async (limit = 3) => {
  let safeLimit = parseInt(limit);
  if (isNaN(safeLimit) || safeLimit < 1) safeLimit = 3;
  if (safeLimit > 100) safeLimit = 100;

  const url = `${API_BASE_URL}/api/setups/top?limit=${safeLimit}`;
  console.log(`🔍 [fetchTopSetups] Request naar: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fetchTopSetups] Fout: ${response.status} - ${errorText}`);
      toast.error('Top setups laden mislukt.');
      return [];
    }

    const result = await response.json();
    console.log('📦 [fetchTopSetups] Data:', result);
    return result;
  } catch (error) {
    console.error('❌ [fetchTopSetups] Fout:', error);
    return [];
  }
};

/*  
✏️ 4. Setup bijwerken
*/
export const updateSetup = async (id, updatedData) => {
  try {
    const url = `${API_BASE_URL}/api/setups/${id}`;
    console.log(`🔍 [updateSetup] PATCH: ${url}`, updatedData);

    const response = await fetchWithRetry(url, 'PATCH', updatedData);

    toast.success('Setup bijgewerkt!');
    return response;
  } catch (error) {
    console.error(`❌ [updateSetup] Fout:`, error);
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
    console.log(`🔍 [deleteSetup] DELETE: ${url}`);

    await fetchWithRetry(url, 'DELETE');

    toast.success('Setup verwijderd!');
  } catch (error) {
    console.error(`❌ [deleteSetup] Fout:`, error);
    toast.error('Verwijderen mislukt.');
    throw error;
  }
};

/*  
➕ 6. Setup toevoegen
*/
export const saveNewSetup = async (newData) => {
  try {
    const url = `${API_BASE_URL}/api/setups`;
    console.log(`🔍 [saveNewSetup] POST: ${url}`, newData);

    const response = await fetchWithRetry(url, 'POST', newData);

    toast.success('Nieuwe setup toegevoegd!');
    return response;
  } catch (error) {
    console.error('❌ [saveNewSetup] Fout:', error);
    toast.error('Toevoegen mislukt.');
    throw error;
  }
};

/*  
🧠 7. AI-uitleg genereren
*/
export const generateExplanation = async (setupId, reloadSetups = null) => {
  try {
    const url = `${API_BASE_URL}/api/setups/explanation/${setupId}`;
    console.log(`🔍 [generateExplanation] POST: ${url}`);

    const response = await fetchWithRetry(url, 'POST');

    if (reloadSetups) await reloadSetups();
    return response;
  } catch (error) {
    console.error('❌ [generateExplanation] Fout:', error);
    toast.error('AI-uitleg genereren mislukt.');
    return { explanation: '' };
  }
};

/*  
🔍 8. Check of naam al bestaat
*/
export const checkSetupNameExists = async (name) => {
  try {
    const url = `${API_BASE_URL}/api/setups/check_name/${encodeURIComponent(name)}`;
    console.log(`🔍 [checkSetupNameExists] GET: ${url}`);

    const res = await fetchWithRetry(url, 'GET');
    return res.exists === true;
  } catch (error) {
    console.error('❌ [checkSetupNameExists] Fout:', error);
    return false;
  }
};
