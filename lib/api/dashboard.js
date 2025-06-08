// ✅ lib/api/dashboard.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal gecombineerde dashboarddata op (macro, market, technical, scores, advies)
export const fetchDashboardData = async () =>
  fetchWithRetry(`${API_BASE_URL}/dashboard`, 'GET');

// ✅ Gezondheidscheck — check of backend draait
export const fetchHealthCheck = async () =>
  fetchWithRetry(`${API_BASE_URL}/health`, 'GET');

// ✅ Haal AI-tradingadvies op — per asset, standaard BTC
export const fetchTradingAdvice = async (symbol = 'BTC') =>
  fetchWithRetry(`${API_BASE_URL}/trading_advice?symbol=${symbol}`, 'GET');

// ✅ Haal top setups op (voor TopSetupsMini of dashboard-visualisatie)
export const fetchTopSetups = async () =>
  fetchWithRetry(`${API_BASE_URL}/top_setups`, 'GET');

// ✅ (Optioneel) Test-API voor debug of CI-checks
export const testDashboardAPI = async () =>
  fetchWithRetry(`${API_BASE_URL}/dashboard/test`, 'GET'); // Alleen gebruiken als route bestaat
