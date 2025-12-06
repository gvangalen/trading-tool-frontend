'use client';

import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { API_BASE_URL } from '@/lib/config';

// ============================================================
// 📊 1) Dashboard hoofddata
// ============================================================
export const fetchDashboardData = async () =>
  fetchWithAuth(`/api/dashboard`, 'GET');

// ============================================================
// ❤️ 2) Gezondheidscheck (mag zonder auth)
// ============================================================
export const fetchHealthCheck = async () =>
  fetchWithAuth(`/api/health`, 'GET');

// ============================================================
// 🤖 3) AI Trading Advies
// ============================================================
export const fetchTradingAdvice = async (symbol = 'BTC') =>
  fetchWithAuth(`/api/ai/trading/trading_advice?symbol=${symbol}`, 'GET');

// ============================================================
// 🏆 4) Top Setups
// ============================================================
export const fetchTopSetups = async () =>
  fetchWithAuth(`/api/top_setups`, 'GET');

// ============================================================
// 🧪 5) Test route (developer only)
// ============================================================
export const testDashboardAPI = async () =>
  fetchWithAuth(`/api/dashboard/test`, 'GET');
