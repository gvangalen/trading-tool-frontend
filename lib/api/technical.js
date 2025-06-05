// ✅ lib/api/technical.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ✅ Haal alle technische data op (laatste 20 entries of volledige lijst)
export const fetchTechnicalData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');

// ✅ Verstuur nieuwe technische data handmatig (gebruik /add endpoint)
export const addTechnicalAsset = (symbol, rsi, volume, ma_200, price, timeframe) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/add`, 'POST', {
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

// ✅ Filter technische data op asset + timeframe (bijv. BTC, 4H)
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

// ✅ Test of de technische API bereikbaar is (voor debugging of frontend checks)
export const testTechnicalAPI = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/test`, 'GET');
