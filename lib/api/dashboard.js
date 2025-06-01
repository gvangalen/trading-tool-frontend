import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';

// ✅ Haal gecombineerde dashboarddata op met scores + uitleg
export const fetchDashboardData = async () =>
  fetchWithRetry('/api/dashboard', 'GET');

// ✅ Gezondheidscheck voor debug/monitoring
export const fetchHealthCheck = async () =>
  fetchWithRetry('/api/health', 'GET');

// ✅ Haal AI tradingadvies op per asset (standaard: BTC)
export const fetchTradingAdvice = async (symbol = 'BTC') =>
  fetchWithRetry(`/api/trading_advice?symbol=${symbol}`, 'GET');

// ✅ Haal top setups op (optioneel voor TopSetupsMini component)
export const fetchTopSetups = async () =>
  fetchWithRetry('/api/top_setups', 'GET');
