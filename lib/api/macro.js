import { fetchWithRetry } from '../utils/fetchWithRetry';

export const addMacroIndicator = (name) =>
  fetchWithRetry('/api/macro_data/add', 'POST', { name });

export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`/api/macro_data/${name}`, 'DELETE');
