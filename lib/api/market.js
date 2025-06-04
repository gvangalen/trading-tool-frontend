import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Market data opslaan (BTC & SOL)
export const saveMarketData = (data) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/save`, 'POST', data);

// ✅ Interpretatie ophalen (alleen BTC)
export const getInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// ✅ Lijst ophalen van alle opgeslagen market data
export const getMarketDataList = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// ✅ Test endpoint (voor debuggen)
export const testMarketEndpoint = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/test`, 'GET');
