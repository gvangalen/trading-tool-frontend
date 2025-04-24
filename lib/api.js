// lib/api.js
import { fetchWithRetry } from './fetchWithRetry';

// ✅ Macro indicator toevoegen
export const addMacroIndicator = (name) =>
  fetchWithRetry('/api/macro_data/add', 'POST', { name });

// ✅ Macro indicator verwijderen (optioneel, als backend dit ondersteunt)
export const deleteMacroIndicator = (name) =>
  fetchWithRetry(`/api/macro_data/${name}`, 'DELETE');

// ✅ Technische asset verwijderen
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');

// ✅ Setup verwijderen (als je dit ondersteunt)
export const deleteSetup = (id) =>
  fetchWithRetry(`/api/setups/${id}`, 'DELETE');

// ✅ Setup aanmaken (optioneel als je POST-logica wil toevoegen)
export const createSetup = (setupData) =>
  fetchWithRetry('/api/setups', 'POST', setupData);

// Meer functies toevoegen per behoefte
// export const generateAIAdvice = (symbol) => ...
// export const updateSetup = (id, data) => ...

