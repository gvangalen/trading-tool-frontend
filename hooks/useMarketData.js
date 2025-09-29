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

export function useMarketData() {
  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);
  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.group('🚀 [useMarketData] Hook init');
    console.log('⏳ Eerste loadData() wordt uitgevoerd...');
    console.groupEnd();

    loadData();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      console.group('📥 [useMarketData] loadData() gestart');

      const history = await fetchMarketData7d();
      console.log('📅 7d-data ontvangen:', history);
      setSevenDayData(history);

      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);

      const grouped = {
        week: week ?? [],
        maand: maand ?? [],
        kwartaal: kwartaal ?? [],
        jaar: jaar ?? [],
      };

      console.log('🔮 Forward returns ontvangen:', grouped);
      setForwardReturns(grouped);

      const score = calculateAverageScore(history);
      console.log('🧮 Berekende avgScore:', score);
      setAvgScore(score);

      const adviesText =
        score >= 1.5 ? '🟢 Bullish' : score <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal';
      console.log('📝 Advies bepaald:', adviesText);
      setAdvies(adviesText);

      console.groupEnd();
    } catch (err) {
      console.error('❌ Fout bij laden marktdata:', err);
      setError('❌ Fout bij laden van marktdata');
    } finally {
      setLoading(false);
    }
  }

  async function loadLiveBTC() {
    try {
      console.group('💰 [useMarketData] loadLiveBTC() gestart');
      const live = await fetchLatestBTC();
      console.log('💹 Live BTC data ontvangen:', live);
      setBtcLive(live);
      console.groupEnd();
    } catch (err) {
      console.error('❌ Fout bij ophalen live BTC:', err);
      setBtcLive(null);
    }
  }

  function calculateAverageScore(data) {
    if (!Array.isArray(data) || data.length === 0) return 'N/A';
    const total = data.reduce((sum, item) => {
      const change = item.change_24h ?? 0;
      if (change > 5) return sum + 2;
      if (change > 2) return sum + 1;
      if (change < -5) return sum - 2;
      if (change < -2) return sum - 1;
      return sum;
    }, 0);
    return (total / data.length).toFixed(1);
  }

  // 🔁 Debug state telkens wanneer data verandert
  useEffect(() => {
    console.group('🔎 [useMarketData] State update');
    console.log('📅 sevenDayData:', sevenDayData);
    console.log('💰 btcLive:', btcLive);
    console.log('🔮 forwardReturns:', forwardReturns);
    console.log('🧮 avgScore:', avgScore);
    console.log('📝 advies:', advies);
    console.groupEnd();
  }, [sevenDayData, btcLive, forwardReturns, avgScore, advies]);

  return {
    sevenDayData,
    forwardReturns,
    btcLive,
    avgScore,
    advies,
    loading,
    error,
  };
}
