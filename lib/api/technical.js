import { fetchWithRetry } from './common';

export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');
