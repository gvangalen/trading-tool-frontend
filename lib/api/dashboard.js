import { fetchWithRetry } from '@lib/utils/fetchWithRetry';

// ✅ Haal gecombineerde dashboarddata op (market, macro, technisch, scores)
export const fetchDashboardData = () =>
  fetchWithRetry('/api/market_data', 'GET');

// ✅ Health check van backend (optioneel handig voor debugging)
export const fetchHealthCheck = () =>
  fetchWithRetry('/api/health', 'GET');

// ✅ Eventueel uitbreidbaar met: advies, top assets, etc.
export const fetchTradingAdvice = (symbol = 'BTC') =>
  fetchWithRetry(`/trading_advice?symbol=${symbol}`, 'GET');
