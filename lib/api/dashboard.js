import { fetchWithRetry } from '@/lib/api';

export const fetchDashboardData = () =>
  fetchWithRetry('/api/market_data');
