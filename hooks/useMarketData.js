'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  fetchMarketDayData,
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  marketIndicatorAdd,
  marketIndicatorDelete,
  getUserMarketIndicators,
} from '@/lib/api/market';

import { getDailyScores } from '@/lib/api/scores';


// Advies logica
const getAdvies = (score) =>
  score >= 75 ? '🟢 Bullish'
    : score <= 25 ? '🔴 Bearish'
    : '⚖️ Neutraal';


// ====================================================================================
// MAIN HOOK
// ====================================================================================
export function useMarketData() {

  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);

  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });

  const [marketScore, setMarketScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  const [marketDayData, setMarketDayData] = useState([]);

  const [activeMarketIndicators, setActiveMarketIndicators] = useState([]);

  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // INIT LOAD
  useEffect(() => {
    loadAll();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // ====================================================================================
  // LOAD ALLES
  // ====================================================================================
  async function loadAll() {
    setLoading(true);

    try {
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);
      setForwardReturns({ week, maand, kwartaal, jaar });

      const dailyScores = await getDailyScores();
      const score = dailyScores?.market?.score ?? 50;

      setMarketScore(score);
      setAdviesState(getAdvies(score));

      const dayData = await fetchMarketDayData();
      setMarketDayData(dayData || []);

      const active = await getUserMarketIndicators();
      setActiveMarketIndicators(active || []);

      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error("❌ loadAll error:", err);
      setError("Kon market data niet laden.");
    } finally {
      setLoading(false);
    }
  }


  // Live BTC
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error("❌ Live BTC error:", err);
      setBtcLive(null);
    }
  }


  // ====================================================================================
  // SCORE RULES VOOR INDICATOR
  // ====================================================================================
  async function selectIndicator(indicatorObj) {
    if (!indicatorObj) return;

    setSelectedIndicator(indicatorObj);

    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObj.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error("❌ scoreregels ophalen:", err);
    }
  }


  // ====================================================================================
  // ADD / DELETE INDICATORS
  // ====================================================================================

  // ➕ Toevoegen
  async function addMarket(indicatorName) {
    try {
      await marketIndicatorAdd(indicatorName);
      await refreshActive();
      await refreshDay();
    } catch (err) {
      console.error("❌ addMarket:", err);
    }
  }

  // ❌ Verwijderen — LET OP: ID GEBRUIKEN!
  async function removeMarket(indicatorId) {
    try {
      await marketIndicatorDelete(indicatorId);
      await refreshActive();
      await refreshDay();
    } catch (err) {
      console.error("❌ removeMarket:", err);
    }
  }


  // ====================================================================================
  // REFRESH HELPERS
  // ====================================================================================
  async function refreshDay() {
    const dayData = await fetchMarketDayData();
    setMarketDayData(dayData || []);
  }

  async function refreshActive() {
    const active = await getUserMarketIndicators();
    setActiveMarketIndicators(active || []);
  }


  // ====================================================================================
  // EXPORT
  // ====================================================================================
  return {
    loading,
    error,

    btcLive,
    marketScore,
    advies,

    sevenDayData,
    forwardReturns,

    marketDayData,
    activeMarketIndicators,

    addMarket,
    removeMarket,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
  };
}
