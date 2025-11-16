'use client';

import { useEffect, useState } from 'react';

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,

  // Nieuwe API's
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

  // =====================================================================
  // STATE
  // =====================================================================

  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);

  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });

  const [marketScore, setMarketScore] = useState('N/A');   // AI score
  const [advies, setAdviesState] = useState('⚖️ Neutraal');

  const [marketIndicators, setMarketIndicators] = useState([]); // daytable

  const [availableIndicators, setAvailableIndicators] = useState([]); // dropdown keuzes

  const [scoreRules, setScoreRules] = useState([]);  // scoreregels van geselecteerde indicator
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =====================================================================
  // INIT
  // =====================================================================
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);


  // =====================================================================
  // 🧩 ALLE DATA LADEN (dagscore, tabel, returns, indicator-namen)
  // =====================================================================
  async function loadAllData() {
    setLoading(true);

    try {
      // 7d chart
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      // forward returns
      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);
      setForwardReturns({ week, maand, kwartaal, jaar });

      // AI market score
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market_score ?? 0;

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

      // daytable
      const active = await fetchActiveMarketIndicators();
      setMarketIndicators(active || []);

      // score view indicator names
      const names = await getMarketIndicatorNames();
      setAvailableIndicators(names || []);

    } catch (err) {
      console.error('❌ Fout bij loadAllData():', err);
      setError('Kon market data niet laden.');
    } finally {
      setLoading(false);
    }
  }


  // =====================================================================
  // 🔄 Live BTC price
  // =====================================================================
  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Fout bij ophalen live BTC:', err);
      setBtcLive(null);
    }
  }


  // =====================================================================
  // 🎯 Score rules ophalen voor geselecteerde indicator
  // =====================================================================
  async function selectIndicator(indicatorObject) {
    if (!indicatorObject) return;

    setSelectedIndicator(indicatorObject);
    setScoreRules([]);

    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObject.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error('❌ Fout bij scoreregels ophalen:', err);
    }
  }


  // =====================================================================
  // ➕ Indicator toevoegen aan daily analyse
  // =====================================================================
  async function addMarketIndicator(name) {
    if (!name) return;

    try {
      await marketDataAdd(name);
      await loadActiveIndicators(); // alleen daytable verversen
    } catch (err) {
      console.error('❌ Fout bij marketDataAdd:', err);
      throw err;
    }
  }


  // =====================================================================
  // 🗑 Indicator verwijderen uit daytable
  // =====================================================================
  async function removeMarketIndicator(name) {
    try {
      await deleteMarketIndicator(name);
      await loadActiveIndicators();
    } catch (err) {
      console.error('❌ Fout bij verwijderen indicator:', err);
    }
  }


  // =====================================================================
  // Helper om enkel de daytable te reloaden
  // =====================================================================
  async function loadActiveIndicators() {
    try {
      const active = await fetchActiveMarketIndicators();
      setMarketIndicators(active || []);
    } catch (err) {
      console.error('❌ Fout bij reload daytable:', err);
    }
  }


  // =====================================================================
  // EXPORT
  // =====================================================================
  return {
    loading,
    error,

    // BTC
    btcLive,

    // Score + Advies
    marketScore,
    advies,

    // History
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
