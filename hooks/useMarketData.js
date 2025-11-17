'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,

  getActiveMarketIndicators,
  marketDataAdd,
  marketDataDelete,

  // 🆕 DAGDATA
  fetchMarketDataDay,

} from '@/lib/api/market';

import { getDailyScores } from '@/lib/api/scores';


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

  // ✅ DIT IS WAT DE TABEL MOET TONEN
  const [marketDayData, setMarketDayData] = useState([]);

  // Voor dropdown/selectie
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


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

      // 🟩 DEZE HAD JE NIET — DIT FIXT ALLES
      const dayData = await fetchMarketDataDay();
      setMarketDayData(dayData || []);

      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ loadAllData:', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }

  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Live BTC error:', err);
      setBtcLive(null);
    }
  }

  async function selectIndicator(indicatorObj) {
    if (!indicatorObj) return;
    setSelectedIndicator(indicatorObj);
    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObj.name);
      setScoreRules(rules || []);
    } catch (err) {}
  }

  async function addMarket(name) {
    try {
      await marketDataAdd(name);
      await refreshDayData();
    } catch (err) {}
  }

  async function removeMarket(name) {
    try {
      await marketDataDelete(name);
      await refreshDayData();
    } catch (err) {}
  }

  async function refreshDayData() {
    const dayData = await fetchMarketDataDay();
    setMarketDayData(dayData || []);
  }


  return {
    loading,
    error,

    btcLive,
    marketScore,
    advies,

    sevenDayData,
    forwardReturns,

    marketDayData,   // ⬅️ TABEL GEBRUIKT DIT
    removeMarket,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,

    addMarket,
  };
}
