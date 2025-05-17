// ✅ Strategie API calls
import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

// Strategieën ophalen
export const fetchStrategies = (asset = '', timeframe = '') =>
  fetchWithRetry(`/api/strategieën?asset=${asset}&timeframe=${timeframe}`);

// Één strategie updaten
export const updateStrategy = (id, data) =>
  fetchWithRetry(`/api/strategieën/${id}`, 'PUT', data);

// Één strategie verwijderen
export const deleteStrategy = (id) =>
  fetchWithRetry(`/api/strategieën/${id}`, 'DELETE');

// AI gegenereerde strategie ophalen (voor specifieke setup/strategie)
export const generateStrategy = (id, overwrite = true) =>
  fetchWithRetry(`/api/strategie/generate/${id}`, 'POST', { overwrite });

// AI alle strategieën opnieuw laten genereren
export const generateAllStrategies = () =>
  fetchWithRetry(`/api/strategie/generate_all`, 'POST');

// Setups ophalen voor koppeling aan strategieën
export const fetchSetups = () =>
  fetchWithRetry('/api/setups');
