'use client';

import { useEffect, useState } from 'react';
import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,
} from '@/lib/api/market';

import { getDailyScores } from '@/lib/api/scores';

// 🧠 Adviesfunctie gebaseerd op AI-score
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      // 📅 7-day history
      const history = await fetchMarketData7d();
      setSevenDayData(history);

      // 🔮 Forward returns
      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);

      setForwardReturns({
        week: week ?? [],
        maand: maand ?? [],
        kwartaal: kwartaal ?? [],
        jaar: jaar ?? [],
      });

      // 🧠 Haal AI-market score op
      const dailyScores = await getDailyScores();
      const aiMarketScore = dailyScores?.market?.score ?? 'N/A';

      setMarketScore(aiMarketScore);
      setAdviesState(getAdvies(aiMarketScore));

    } catch (err) {
      console.error('❌ Fout bij laden marktdata:', err);
      setError('❌ Fout bij laden marktdata');
    } finally {
      setLoading(false);
    }
  }

  async function loadLiveBTC() {
    try {
      const live = await fetchLatestBTC();
      setBtcLive(live);
    } catch (err) {
      console.error('❌ Fout bij live BTC ophalen:', err);
      setBtcLive(null);
    }
  }

  return {
    sevenDayData,
    forwardReturns,
    btcLive,
    marketScore, // ← AI-score ipv eigen berekening
    advies,      // ← AI advies
    loading,
    error,
  };
}
