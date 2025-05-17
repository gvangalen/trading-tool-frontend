import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

export const fetchDashboardData = () =>
  fetchWithRetry('/api/market_data');
