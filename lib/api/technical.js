import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📥 1. Haal alle technische data op
export const fetchTechnicalData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');

// ➕ 2. Voeg handmatig nieuwe technische data toe
export const addTechnicalAsset = (symbol, rsi, volume, ma_200, price, timeframe) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/add`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    price,
    timeframe,
  });

// 🗑️ 3. Verwijder technische data op basis van ID
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${id}`, 'DELETE');

// ✅ Alias voor consistent gebruik in hooks
export const deleteTechnicalIndicator = deleteTechnicalAsset;

// 🔍 4. Filter technische data op asset en timeframe
export const fetchTechnicalDataForAsset = (symbol, timeframe) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}/${timeframe}`, 'GET');

// 📡 5. Ontvang webhook data vanuit TradingView
export const sendTechnicalWebhook = (symbol, rsi, volume, ma_200, price) =>
  fetchWithRetry(`${API_BASE_URL}/api/tradingview_webhook`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    price,
  });

// 🧪 6. Test of de technische API bereikbaar is
export const testTechnicalAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/test`, 'GET');
