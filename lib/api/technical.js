import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`/api/technical_data/${id}`, 'DELETE');
