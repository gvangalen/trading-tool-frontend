'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // ✔ nieuwe correcte user-based API
  fetchMarketDayData,
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  marketIndicatorAdd,
  marketIndicatorDelete,
  getUserMarketIndicators,
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

  // Dagelijkse indicatoren (TABEL)
  const [marketDayData, setMarketDayData] = useState([]);

  // Actieve indicatoren (UI)
  const [activeMarketIndicators, setActiveMarketIndicators] = useState([]);

  // Dropdown + logica
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  // Loading / Error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // INIT
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // ===============================================================
  // ALLES LADEN
  // ===============================================================
  async function loadAllData() {
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
      const aiMarketScore = dailyScores?.market?.score ?? 50;
      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      // ✔ User-specific dagdata
      const dayData = await fetchMarketDayData();
      setMarketDayData(dayData || []);

      // ✔ User indicator lijst
      const active = await getUserMarketIndicators();
      setActiveMarketIndicators(active || []);

      // ✔ Beschikbare globale indicatornamen
      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ loadAllData:', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // LIVE BTC
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Live BTC error:', err);
      setBtcLive(null);
    }
  }


  // SCORE RULE SELECTIE
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


  // INDICATOR TOEVOEGEN (per gebruiker)
  async function addMarket(name) {
    try {
      await marketIndicatorAdd(name);
      await refreshDayData();
      await refreshActiveIndicators();
    } catch (err) {
      console.error("❌ addMarket:", err);
    }
  }

  // INDICATOR VERWIJDEREN (per gebruiker)
  async function removeMarket(name) {
    try {
      await marketIndicatorDelete(name);
      await refreshDayData();
      await refreshActiveIndicators();
    } catch (err) {
      console.error("❌ removeMarket:", err);
    }
  }


  // REFRESH HELPERS
  async function refreshDayData() {
    const dayData = await fetchMarketDayData();
    setMarketDayData(dayData || []);
  }

  async function refreshActiveIndicators() {
    const active = await getUserMarketIndicators();
    setActiveMarketIndicators(active || []);
  }


  // EXPORTS
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
    removeMarket,
    addMarket,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
  };
}
