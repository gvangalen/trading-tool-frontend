'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // Scorelogica
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,

  // Active indicatoren (dagtabel)
  getActiveMarketIndicators,

  // Indicator beheer
  marketDataAdd,
  marketDataDelete,

  // Dagdata VAN DE DAG!
  fetchMarketDataDay,

} from '@/lib/api/market';

import { getDailyScores } from '@/lib/api/scores';


// ===============================================================
// Advies logica
// ===============================================================
const getAdvies = (score) =>
  score >= 75 ? '🟢 Bullish'
    : score <= 25 ? '🔴 Bearish'
    : '⚖️ Neutraal';


// ===============================================================
// MAIN HOOK
// ===============================================================
export function useMarketData() {

  // Markt charts
  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);

  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });

  // Dashboard meter
  const [marketScore, setMarketScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  // Dagelijkse indicatoren (VOOR TABEL)
  const [marketDayData, setMarketDayData] = useState([]);

  // Actieve indicatoren (VOOR UI)
  const [activeMarketIndicators, setActiveMarketIndicators] = useState([]);

  // Dropdown + logica
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // ===============================================================
  // INIT
  // ===============================================================
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // ===============================================================
  // ALLE MARKET DATA LADEN
  // ===============================================================
  async function loadAllData() {
    setLoading(true);

    try {
      //
      // 1️⃣ Live charts (7d, returns)
      //
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);
      setForwardReturns({ week, maand, kwartaal, jaar });

      //
      // 2️⃣ Dashboard Market Score (daily_scores)
      //
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market?.score ?? 50;

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      //
      // 3️⃣ Dagelijkse indicatorwaarden (TABEL)
      //
      const dayData = await fetchMarketDataDay();
      setMarketDayData(dayData || []);

      //
      // 4️⃣ Actieve indicatoren (user actief in analyse)
      //
      const active = await getActiveMarketIndicators();
      setActiveMarketIndicators(active || []);

      //
      // 5️⃣ Beschikbare indicators (scoreview dropdown)
      //
      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ loadAllData:', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // ===============================================================
  // BTC LIVE PRICE
  // ===============================================================
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Live BTC error:', err);
      setBtcLive(null);
    }
  }


  // ===============================================================
  // SCORE RULES SELECTIE
  // ===============================================================
  async function selectIndicator(indicatorObj) {
    if (!indicatorObj) return;
    setSelectedIndicator(indicatorObj);

    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObj.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ scoreregels ophalen:', err);
    }
  }


  // ===============================================================
  // INDICATOR TOEVOEGEN
  // ===============================================================
  async function addMarket(name) {
    try {
      await marketDataAdd(name);
      await refreshDayData();
      await refreshActiveIndicators();
    } catch (err) {
      console.error("❌ addMarket:", err);
    }
  }

  // ===============================================================
  // INDICATOR VERWIJDEREN
  // ===============================================================
  async function removeMarket(name) {
    try {
      await marketDataDelete(name);
      await refreshDayData();
      await refreshActiveIndicators();
    } catch (err) {
      console.error("❌ removeMarket:", err);
    }
  }


  // ===============================================================
  // REFRESH HELPERS
  // ===============================================================
  async function refreshDayData() {
    const dayData = await fetchMarketDataDay();
    setMarketDayData(dayData || []);
  }

  async function refreshActiveIndicators() {
    const active = await getActiveMarketIndicators();
    setActiveMarketIndicators(active || []);
  }


  // ===============================================================
  // EXPORT
  // ===============================================================
  return {
    loading,
    error,

    // Dashboard
    btcLive,
    marketScore,
    advies,

    // Charting
    sevenDayData,
    forwardReturns,

    // Daily table
    marketDayData,
    activeMarketIndicators,
    removeMarket,
    addMarket,

    // Score Logic UI
    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
  };
}
