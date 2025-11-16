'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // 🔥 Nieuwe API’s voor scorelogica & tabel
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  marketDataAdd,
  fetchActiveMarketIndicators,
  deleteMarketIndicator,
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

  // 🆕 Market score vanuit DB rule engine
  const [marketScore, setMarketScore] = useState('N/A');
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  // 🆕 Market-indicatoren voor daytable
  const [marketIndicators, setMarketIndicators] = useState([]);

  // 🆕 Score logic (selecteer indicator → bekijk scoreregels)
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =========================================================
  // 📡 INIT LOAD
  // =========================================================
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // =========================================================
  // 📦 Alles laden (scores, tabel, forward returns)
  // =========================================================
  async function loadAllData() {
    setLoading(true);
    try {
      // 7-day history
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

      // 🧠 AI-driven Market score
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market_score ?? 0;

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      // 🆕 Tabel: actieve indicators ophalen
      const active = await fetchActiveMarketIndicators();
      setMarketIndicators(active || []);

      // 🆕 Score logic: lijst met indicators
      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ Fout bij loadAllData()', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // 🔄 Live BTC price (60s interval)
  // =========================================================
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Fout bij live BTC ophalen:', err);
      setBtcLive(null);
    }
  }

  // =========================================================
  // 🎯 Score rules ophalen voor selecteer indicator
  // =========================================================
  async function selectIndicator(nameObject) {
    if (!nameObject) return;

    setSelectedIndicator(nameObject);
    setScoreRules([]);

    try {
      const rules = await getScoreRulesForMarketIndicator(nameObject.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ Fout bij scoreregels ophalen:', err);
    }
  }

  // =========================================================
  // ➕ Indicator toevoegen aan market analyse
  // =========================================================
  async function addMarketIndicator(name) {
    if (!name) return;

    try {
      await marketDataAdd(name);
      await loadActiveIndicators(); // refresh tabel
    } catch (err) {
      console.error('❌ Fout bij marketDataAdd:', err);
      throw err;
    }
  }

  // =========================================================
  // 🗑 Indicator verwijderen
  // =========================================================
  async function removeMarketIndicator(name) {
    try {
      await deleteMarketIndicator(name);
      await loadActiveIndicators();
    } catch (err) {
      console.error('❌ Verwijderen mislukt:', err);
    }
  }

  // Helper om alleen tabel te herladen
  async function loadActiveIndicators() {
    const active = await fetchActiveMarketIndicators();
    setMarketIndicators(active || []);
  }


  // EXPORT NAAR COMPONENTS
  return {
    loading,
    error,

    // Live BTC
    btcLive,

    // AI-driven score + advies
    marketScore,
    advies,

    // History + returns
    sevenDayData,
    forwardReturns,

    // Daytable
    marketIndicators,
    removeMarketIndicator,

    // Score view
    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
    addMarketIndicator,
  };
}
