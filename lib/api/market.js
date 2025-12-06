'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { API_BASE_URL } from '@/lib/config';

//
// =======================================================
// 📌 1) PUBLIC MARKET DATA (MAG ZONDER AUTH)
// =======================================================
//

// 1.1 7-daagse BTC history
export const fetchMarketData7d = () =>
  fetchWithRetry(`/api/market_data/7d`, 'GET');

// 1.2 Live BTC prijs
export const fetchLatestBTC = () =>
  fetchWithRetry(`/api/market_data/btc/latest`, 'GET');

// 1.3 Forward returns – openbare endpoints
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
// 📌 2) AUTH MARKET DATA (PER USER) — fetchWithAuth
// =======================================================
//

// 2.1 Dagelijkse marktdata (BELANGRIJK!)
export const fetchMarketDayData = () =>
  fetchWithAuth(`/api/market_data/day`, 'GET');

// 2.2 Volledige market list
export const fetchMarketData = () =>
  fetchWithAuth(`/api/market_data/list`, 'GET');

// 2.3 Handmatige refresh
export const saveMarketData = () =>
  fetchWithAuth(`/api/market_data`, 'POST');

// 2.4 Geïnterpreteerde marktdata
export const fetchInterpretedMarketData = () =>
  fetchWithAuth(`/api/market_data/interpreted`, 'GET');


//
// =======================================================
// 📌 3) MARKET INDICATOR SYSTEM — AUTH VERPLICHT
// =======================================================
//

// 3.1 Beschikbare indicatornamen (uit DB)
export const getMarketIndicatorNames = () =>
  fetchWithAuth(`/api/market/indicator_names`, 'GET');

// 3.2 Scoreregels per indicator
export const getScoreRulesForMarketIndicator = (name) =>
  fetchWithAuth(`/api/market/indicator_rules/${name}`, 'GET');

// 3.3 Actieve indicatoren voor de gebruiker
export const getActiveMarketIndicators = () =>
  fetchWithAuth(`/api/market/active_indicators`, 'GET');

// 3.4 Indicator toevoegen
export const marketDataAdd = (indicatorName) =>
  fetchWithAuth(`/api/market/add_indicator`, 'POST', {
    indicator: indicatorName,
  });

// 3.5 Indicator verwijderen
export const marketDataDelete = (indicatorName) =>
  fetchWithAuth(`/api/market/delete_indicator/${indicatorName}`, 'DELETE');
