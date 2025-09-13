import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📥 1. Haal alle technische data op
export const technicalDataAll = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'GET');

// ➕ 2. Voeg handmatig nieuwe technische data toe
export const technicalDataAdd = (symbol, rsi, volume, ma_200, timeframe = '1D') =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    timeframe,
  });

// 🗑️ 3. Verwijder technische data op basis van ID
export const technicalDataDelete = (id) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${id}`, 'DELETE');

// ✅ Alias voor consistent gebruik in hooks
export const deleteTechnicalIndicator = technicalDataDelete;

// 🔍 4. Filter technische data op asset
export const technicalDataBySymbol = (symbol) =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/${symbol}`, 'GET');

// 📊 5. Technische samenvattingen per periode
export const technicalDataDay = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/day`, 'GET');

export const technicalDataWeek = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/week`, 'GET');

export const technicalDataMonth = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/month`, 'GET');

export const technicalDataQuarter = () =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/quarter`, 'GET');

// 📡 6. Webhook vanuit TradingView
export const technicalDataWebhook = (symbol, rsi, volume, ma_200, timeframe = '1D') =>
  fetchWithRetry(`${API_BASE_URL}/api/technical_data/webhook`, 'POST', {
    symbol,
    rsi,
    volume,
    ma_200,
    timeframe,
  });
