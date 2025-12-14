'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { fetchAuth } from '@/lib/api/auth';

//
// =======================================================
// 📌 1) PUBLIC MARKET DATA (GEEN AUTH)
// =======================================================
//

export const fetchMarketData7d = () =>
  fetchWithRetry(`/api/market_data/7d`, 'GET');

export const fetchLatestBTC = () =>
  fetchWithRetry(`/api/market_data/btc/latest`, 'GET');

export const fetchForwardReturnsWeek = () =>
  fetchWithRetry(`/api/market_data/forward/week`, 'GET');

export const fetchForwardReturnsMonth = () =>
  fetchWithRetry(`/api/market_data/forward/maand`, 'GET');

export const fetchForwardReturnsQuarter = () =>
  fetchWithRetry(`/api/market_data/forward/kwartaal`, 'GET');

export const fetchForwardReturnsYear = () =>
  fetchWithRetry(`/api/market_data/forward/jaar`, 'GET');


//
// =======================================================
// 📌 2) USER MARKET DATA — IDENTIEK AAN MACRO / TECHNICAL
// =======================================================
//

// ✔ User dagdata
export const fetchMarketDayData = () =>
  fetchAuth(`/api/market_data/day`, { method: 'GET' });

// ✔ User volledige history
export const fetchUserMarketHistory = () =>
  fetchAuth(`/api/market_data/indicators`, { method: 'GET' });


//
// =======================================================
// 📌 3) MARKET INDICATOR SYSTEM (PER USER)
// =======================================================
//

// ✔ Beschikbare indicatornamen (globaal)
export const getMarketIndicatorNames = () =>
  fetchAuth(`/api/market/indicator_names`, { method: 'GET' });

// ✔ Scoreregels (globaal)
export const getScoreRulesForMarketIndicator = (name) =>
  fetchAuth(`/api/market/indicator_rules/${name}`, { method: 'GET' });

// ✔ User indicatoren (zelfde endpoint als history)
export const getUserMarketIndicators = () =>
  fetchAuth(`/api/market_data/indicators`, { method: 'GET' });

// ✔ Toevoegen (per gebruiker)
export const marketIndicatorAdd = (indicatorName) =>
  fetchAuth(`/api/market_data/indicator`, {
    method: 'POST',
    body: JSON.stringify({ indicator: indicatorName }),
  });

// ✅ VERWIJDEREN — OP **NAME**, NIET OP ID
export const marketIndicatorDelete = (indicatorName) => {
  if (!indicatorName) {
    throw new Error('indicatorName is verplicht');
  }

  return fetchAuth(`/api/market_data/indicator/${indicatorName}`, {
    method: 'DELETE',
  });
};
