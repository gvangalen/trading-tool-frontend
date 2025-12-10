'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { fetchAuth } from '@/lib/api/auth';
import { API_BASE_URL } from '@/lib/config';

//
// =======================================================
// 📌 1) PUBLIC MARKET DATA (GEEN AUTH NODIG)
// =======================================================
//

// 1.1 7-daagse BTC history
export const fetchMarketData7d = () =>
  fetchWithRetry(`/api/market_data/7d`, 'GET');

// 1.2 Live BTC prijs
export const fetchLatestBTC = () =>
  fetchWithRetry(`/api/market_data/btc/latest`, 'GET');

// 1.3 Forward returns – publieke routes
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
// 📌 2) MARKET DATA SNAPSHOTS (ZONDER AUTH)
// =======================================================
//

// 2.1 Dagelijkse marktdata snapshot (per user in backend)
export const fetchMarketDayData = () =>
  fetchWithRetry(`/api/market_data/day`, 'GET');

// 2.2 Volledige lijst (global)
export const fetchMarketData = () =>
  fetchWithRetry(`/api/market_data/list`, 'GET');

// 2.3 Handmatige refresh (global)
export const saveMarketData = () =>
  fetchWithRetry(`/api/market_data`, 'POST');

// 2.4 Interpreted market data
export const fetchInterpretedMarketData = () =>
  fetchWithRetry(`/api/market_data/interpreted`, 'GET');


//
// =======================================================
// 📌 3) MARKET INDICATOR SYSTEM — PER USER
// =======================================================
//

// 3.1 Beschikbare indicatornamen (globale config)
export const getMarketIndicatorNames = () =>
  fetchAuth(`/api/market/indicator_names`, {
    method: 'GET',
  });

// 3.2 Scoreregels voor indicator (globaal)
export const getScoreRulesForMarketIndicator = (name) =>
  fetchAuth(`/api/market/indicator_rules/${name}`, {
    method: 'GET',
  });

// 3.3 Actieve indicatoren van de gebruiker
export const getUserMarketIndicators = () =>
  fetchAuth(`/api/market/indicator`, {
    method: 'GET',
  });


// 3.4 Indicator toevoegen (per gebruiker)
export const marketIndicatorAdd = (indicatorName) =>
  fetchAuth(`/api/market/indicator`, {
    method: 'POST',
    body: JSON.stringify({ name: indicatorName }),
  });


// 3.5 Indicator verwijderen (per gebruiker)
export const marketIndicatorDelete = (indicatorName) =>
  fetchAuth(`/api/market/indicator/${indicatorName}`, {
    method: 'DELETE',
  });
