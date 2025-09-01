import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ 1. Haal laatste marktdata op (voor dashboard + tabellen)
export const fetchMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/list`, 'GET');

// ✅ 2. Sla nieuwe marktdata op vanuit CoinGecko (handmatige update)
export const saveMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/save`, 'POST');

// ✅ 3. Haal BTC-data op met interpretatie + score (voor adviescomponent)
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/interpreted`, 'GET');

// ✅ 4. Test-API (voor debugging of CI-checks)
export const testMarketAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/test`, 'GET');

// 🗑️ 5. Verwijder een markt asset op basis van ID
export const deleteMarketAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/${id}`, 'DELETE');

// ✅ 6. Haal 7-daagse historische marktdata op (voor MarketSevenDayTable)
export const fetchMarketData7d = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/7d`, 'GET');

// ✅ 7. Haal return data op per periode (week, maand, kwartaal, jaar)
export const fetchMarketReturnByPeriod = (periode) =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/returns/${periode}`, 'GET');

// ✅ 8. Haalt live bitcoin prijs op 
export async function fetchLatestBTC() {
  const res = await fetch('/api/market_data/btc/latest');
  if (!res.ok) throw new Error('Fout bij ophalen BTC prijs');
  return await res.json();

  // ✅ 9. Haal forward return data op (alleen BTC)
export const fetchForwardReturns = () =>
  fetchWithRetry(`${API_BASE_URL}/api/market_data/forward`, 'GET');
}
