'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // ✔ Nieuwe API’s
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  fetchMarketDayData,     // ✅ juiste dagtabel route
  marketDataAdd,
  marketDataDelete,

} from '@/lib/api/market';

import { getDailyScores } from '@/lib/api/scores';


// 🧠 Adviesfunctie
const getAdvies = (score) =>
  score >= 75 ? '🟢 Bullish'
    : score <= 25 ? '🔴 Bearish'
      : '⚖️ Neutraal';


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

  // Dagelijkse market-indicatoren
  const [marketIndicators, setMarketIndicators] = useState([]);

  // Score rules view
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =========================================================
  // INIT
  // =========================================================
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // =========================================================
  // ALLES LADEN
  // =========================================================
  async function loadAllData() {
    setLoading(true);

    try {
      // 7-day data
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      // Forward returns
      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);

      setForwardReturns({ week, maand, kwartaal, jaar });

      // Market score
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market_score ?? 0;

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      // ✔ Dagelijkse indicatoren ophalen
      const active = await fetchMarketDayData();
      setMarketIndicators(active || []);

      // ✔ Alle indicatornamen ophalen
      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ loadAllData:', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // LIVE BTC PRICE
  // =========================================================
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Live BTC error:', err);
      setBtcLive(null);
    }
  }


  // =========================================================
  // SCORE RULES
  // =========================================================
  async function selectIndicator(indicatorObj) {
    if (!indicatorObj) return;

    setSelectedIndicator(indicatorObj);
    setScoreRules([]);

    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObj.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ scoreregels ophalen:', err);
    }
  }


  // =========================================================
  // ADD MARKET INDICATOR
  // =========================================================
  async function addMarket(name) {
    if (!name) return;

    try {
      await marketDataAdd(name);
      await loadActiveIndicators();
    } catch (err) {
      console.error('❌ addMarket:', err);
    }
  }


  // =========================================================
  // REMOVE MARKET INDICATOR
  // =========================================================
  async function removeMarket(name) {
    try {
      await marketDataDelete(name);
      await loadActiveIndicators();
    } catch (err) {
      console.error('❌ removeMarket:', err);
    }
  }


  // =========================================================
  // DAGTABEL OPNIEUW LADEN
  // =========================================================
  async function loadActiveIndicators() {
    const active = await fetchMarketDayData();
    setMarketIndicators(active || []);
  }


  // =========================================================
  // EXPORT
  // =========================================================
  return {
    loading,
    error,

    btcLive,
    marketScore,
    advies,

    sevenDayData,
    forwardReturns,

    marketIndicators,
    removeMarket,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,

    addMarket,
  };
}
