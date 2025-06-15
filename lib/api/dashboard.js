import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal gecombineerde dashboarddata op
export const fetchDashboardData = async () =>
  fetchWithRetry(`${API_BASE_URL}/api/dashboard`, 'GET');

// ✅ Gezondheidscheck
export const fetchHealthCheck = async () =>
  fetchWithRetry(`${API_BASE_URL}/api/health`, 'GET');

// ✅ Haal AI-tradingadvies op per asset
export const fetchTradingAdvice = async (symbol = 'BTC') =>
  fetchWithRetry(`${API_BASE_URL}/api/trading_advice?symbol=${symbol}`, 'GET');

// ✅ Haal top setups op
export const fetchTopSetups = async () =>
  fetchWithRetry(`${API_BASE_URL}/api/top_setups`, 'GET');

// ✅ (Optioneel) Test route
export const testDashboardAPI = async () =>
  fetchWithRetry(`${API_BASE_URL}/api/dashboard/test`, 'GET');
