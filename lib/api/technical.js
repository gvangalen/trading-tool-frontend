import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📥 1. Haal alle technische data op
export const fetchTechnicalData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');

// ➕ 2. Voeg handmatig nieuwe technische data toe
export const addTechnicalAsset = (symbol, rsi, volume, ma_200, timeframe = '1D') =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    timeframe,
  });

// 🗑️ 3. Verwijder technische data op basis van ID
export const deleteTechnicalAsset = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${id}`, 'DELETE');

// ✅ Alias voor consistent gebruik in hooks
export const deleteTechnicalIndicator = deleteTechnicalAsset;

// 🔍 4. Filter technische data op asset
export const fetchTechnicalDataForAsset = (symbol) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'GET');

// 📊 Nieuwe technische samenvattingen per timeframe
export const fetchTechnicalDayData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical/day`, 'GET');

export const fetchTechnicalWeekData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical/week`, 'GET');

export const fetchTechnicalMonthData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical/month`, 'GET');

export const fetchTechnicalQuarterData = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical/quarter`, 'GET');

// 📡 5. Ontvang webhook data vanuit TradingView
export const sendTechnicalWebhook = (symbol, rsi, volume, ma_200, timeframe = '1D') =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/webhook`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    timeframe,
  });
