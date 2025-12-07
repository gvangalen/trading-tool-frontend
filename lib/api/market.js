'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { fetchAuth } from '@/lib/api/auth';  // ✅ JUISTE AUTH
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
// 📌 2) AUTH MARKET DATA (PER-GEBRUIKER)
// =======================================================
//

// 2.1 Dagelijkse marktdata
export const fetchMarketDayData = () =>
  fetchAuth(`/api/market_data/day`, { method: 'GET' });

// 2.2 Volledige market list
export const fetchMarketData = () =>
  fetchAuth(`/api/market_data/list`, { method: 'GET' });

// 2.3 Handmatige refresh
export const saveMarketData = () =>
  fetchAuth(`/api/market_data`, { method: 'POST' });

// 2.4 Geïnterpreteerde marktdata
export const fetchInterpretedMarketData = () =>
  fetchAuth(`/api/market_data/interpreted`, { method: 'GET' });


//
// =======================================================
// 📌 3) MARKET INDICATOR SYSTEM — AUTH VERPLICHT
// =======================================================
//

// 3.1 Beschikbare indicatornamen
export const getMarketIndicatorNames = () =>
  fetchAuth(`/api/market/indicator_names`, { method: 'GET' });

// 3.2 Scoreregels voor indicator
export const getScoreRulesForMarketIndicator = (name) =>
  fetchAuth(`/api/market/indicator_rules/${name}`, { method: 'GET' });

// 3.3 Actieve indicatoren voor user
export const getActiveMarketIndicators = () =>
  fetchAuth(`/api/market/active_indicators`, { method: 'GET' });

// 3.4 Indicator toevoegen
export const marketDataAdd = (indicatorName) =>
  fetchAuth(`/api/market/add_indicator`, {
    method: 'POST',
    body: JSON.stringify({ indicator: indicatorName }),
  });

// 3.5 Indicator verwijderen
export const marketDataDelete = (indicatorName) =>
  fetchAuth(`/api/market/delete_indicator/${indicatorName}`, {
    method: 'DELETE',
  });
