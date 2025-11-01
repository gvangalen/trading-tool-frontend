'use client';

import { useEffect, useState } from 'react';
import {
  fetchMacroDataByDay,
  fetchMacroDataByWeek,
  fetchMacroDataByMonth,
  fetchMacroDataByQuarter,
} from '@/lib/api/macro';
import { getDailyScores } from '@/lib/api/scores';

export function useMacroData(activeTab = 'Dag') {
  const [macroData, setMacroData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      let data;
      switch (activeTab) {
        case 'Dag':
          data = await fetchMacroDataByDay();
          break;
        case 'Week':
          data = await fetchMacroDataByWeek();
          break;
        case 'Maand':
          data = await fetchMacroDataByMonth();
          break;
        case 'Kwartaal':
          data = await fetchMacroDataByQuarter();
          break;
        default:
          data = await fetchMacroDataByDay();
      }

      if (!Array.isArray(data)) throw new Error('Macrodata is geen lijst');

      const enriched = data.map((item) => ({
        indicator: item.indicator || item.name || '–',
        waarde: item.waarde ?? item.value ?? '–',
        score: parseFloat(item.score) ?? null,
        trend: item.trend || '–',                                // ✅ Toegevoegd
        interpretation: item.interpretation || '–',              // ✅ Toegevoegd
        action: item.action || '–',                              // ✅ Toegevoegd
        symbol: item.symbol || '',
        timestamp: item.timestamp || null,
        dateObj: item.timestamp ? new Date(item.timestamp) : null,
      }));

      // 🔹 Data groeperen per tijdseenheid
      if (activeTab === 'Week') {
        setMacroData(groupByDay(enriched));
      } else if (activeTab === 'Maand') {
        setMacroData(groupByMonth(enriched));
      } else if (activeTab === 'Kwartaal') {
        setMacroData(groupByQuarter(enriched));
      } else {
        setMacroData(enriched);
      }

      // 🔹 Gemiddelde score ophalen
      const scores = await getDailyScores();
      const backendScore = scores?.macro_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);
        setAdvies(
          backendScore >= 75
            ? '🟢 Bullish'
            : backendScore <= 25
            ? '🔴 Bearish'
            : '⚖️ Neutraal'
        );
      } else {
        updateScore(enriched);
      }
    } catch (err) {
      console.warn('⚠️ Macrodata kon niet worden geladen:', err);
      setMacroData([]);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden van macrodata');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Gemiddelde berekening fallback
  function updateScore(data) {
    let total = 0;
    let count = 0;

    data.forEach((ind) => {
      const s = parseFloat(ind.score);
      if (!isNaN(s)) {
        total += s;
        count++;
      }
    });

    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(
      avg >= 70 ? '🟢 Bullish' : avg <= 40 ? '🔴 Bearish' : '⚖️ Neutraal'
    );
  }

  // ✅ Weekdata -> per dag groeperen
  function groupByDay(data) {
  const grouped = {};
  for (const item of data) {
    if (!item.dateObj) continue;

    // ✅ Weeknummer & jaartal berekenen
    const date = item.dateObj;
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    const year = date.getUTCFullYear();

    // ✅ Groeperen op week
    const key = `${year}-W${weekNo}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  return Object.entries(grouped)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => {
      const [year, week] = key.split('-W');
      const label = `📅 Week ${week} – ${year}`;
      return { label, data: items };
    });
}


  // ✅ Maanddata -> per maand groeperen
  function groupByMonth(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getFullYear();
      const month = item.dateObj.getMonth() + 1;
      const key = `${year}-${month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => {
        const [year, month] = key.split('-');
        const label = `📅 ${getMonthName(month)} ${year}`;
        return { label, data: items };
      });
  }

  // ✅ Kwartaaldata -> per kwartaal groeperen
  function groupByQuarter(data) {
    const grouped = {};
    for (const item of data) {
      if (!item.dateObj) continue;
      const year = item.dateObj.getFullYear();
      const quarter = Math.floor(item.dateObj.getMonth() / 3) + 1;
      const key = `${year}-Q${quarter}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    return Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({
        label: `📊 Kwartaal ${key.split('-Q')[1]} – ${key.split('-Q')[0]}`,
        data: items,
      }));
  }

  // ✅ Nederlandse maandnamen
  function getMonthName(monthNum) {
    const maanden = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
    ];
    return maanden[parseInt(monthNum, 10) - 1] || 'Onbekend';
  }

  // ✅ Uitleg per macro-indicator
  function getExplanation(name) {
    const uitleg = {
      fear_greed_index: "Lage waarde = angst, hoge waarde = hebzucht.",
      btc_dominance: "Hoge dominantie = minder altcoin-risico.",
      dxy: "Lage DXY = gunstig voor crypto.",
      sp500: "Sterke S&P500 wijst op risk-on marktsentiment.",
      vix: "Hoge VIX duidt op onzekerheid in de markt.",
      inflation_rate: "Hoge inflatie vermindert koopkracht en verhoogt risico.",
      interest_rate: "Hogere rente beperkt liquiditeit in markten.",
      oil_price: "Hoge olieprijzen kunnen inflatie aanwakkeren.",
    };
    return uitleg[name] || "Geen uitleg beschikbaar.";
  }

  // ✅ Verwijderen
  function handleRemove(symbol) {
    const updated = macroData.filter((item) => item.symbol !== symbol);
    setMacroData(updated);
  }

  // ✅ Exporteren van alle waarden
  return {
    macroData,
    avgScore,
    advies,
    handleRemove,
    loading,
    error,
    getExplanation, // ✅ toegevoegd zodat de tabellen dit kunnen gebruiken
  };
}
