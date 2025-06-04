import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal alle technische data op (laatste 20)
export const fetchTechnicalData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');

// ✅ Verstuur nieuwe technische data handmatig
export const addTechnicalAsset = (symbol, rsi, volume, ma_200, price, timeframe) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    price,
    timeframe
  });

// ✅ Verwijder technische data op basis van ID
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${id}`, 'DELETE');

// ✅ Filter op specifieke asset + timeframe
export const fetchTechnicalDataForAsset = (symbol, timeframe) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}/${timeframe}`, 'GET');

// ✅ Verstuur webhook data vanuit TradingView
export const sendTechnicalWebhook = (symbol, rsi, volume, ma_200, price) =>
  fetchWithRetry(`${API_BASE_URL}/api/tradingview_webhook`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    price
  });
