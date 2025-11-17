'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // Scorelogica API’s
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,

  // Dagelijks gescoorde indicatorwaarden
  getActiveMarketIndicators,

  // Toevoegen / verwijderen uit analyse
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

  // 7-daagse ohlc
  const [sevenDayData, setSevenDayData] = useState([]);

  // Live BTC
  const [btcLive, setBtcLive] = useState(null);

  // Forward returns (week/maand/kwartaal/jaar)
  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });

  // Dagelijkse AI-market-score
  const [marketScore, setMarketScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  // Actieve indicatoren (dagtabel)
  const [marketIndicators, setMarketIndicators] = useState([]);

  // Score rules panel
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
      // -------------------------------------
      // 📌 7-daagse data
      // -------------------------------------
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      // -------------------------------------
      // 📌 Forward returns
      // -------------------------------------
      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);

      setForwardReturns({ week, maand, kwartaal, jaar });

      // -------------------------------------
      // 📌 Dagelijkse AI market-score
      // -------------------------------------
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market_score ?? 50; // fallback 50

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      // -------------------------------------
      // 🟦 Actieve indicatoren (dagtabel)
      // -------------------------------------
      const indicators = await getActiveMarketIndicators();
      setMarketIndicators(indicators || []);

      // -------------------------------------
      // 🟩 Alle indicatornamen voor select UI
      // -------------------------------------
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
  // INDICATOR TOEVOEGEN
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
  // INDICATOR VERWIJDEREN
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
  // 🟦 ACTIEVE DAGRAPPORT INDICATOREN OPNIEUW LADEN
  // =========================================================
  async function loadActiveIndicators() {
    const active = await getActiveMarketIndicators();
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
