'use client';

import { useState, useEffect } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
} from '@/lib/api/technical';

import { getDailyScores } from '@/lib/api/scores'; // ⬅️ haalt totale technische score op

export function useTechnicalData(activeTab = 'day') {
  const [dayData, setDayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [quarterData, setQuarterData] = useState([]);

  const [avgScore, setAvgScore] = useState(null); // ✅ gemiddelde binnen huidige timeframe
  const [advies, setAdvies] = useState('Neutral');

  const [overallScore, setOverallScore] = useState(null); // ✅ totale technical_score uit daily-scores API
  const [overallAdvies, setOverallAdvies] = useState('Neutral');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Haal technische data op per timeframe
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError('');

      try {
        console.log('📡 Fetching technical data...');
        const [day, week, month, quarter] = await Promise.all([
          technicalDataDay(),
          technicalDataWeek(),
          technicalDataMonth(),
          technicalDataQuarter(),
        ]);

        setDayData(Array.isArray(day) ? day : []);
        setWeekData(Array.isArray(week) ? week : []);
        setMonthData(Array.isArray(month) ? month : []);
        setQuarterData(Array.isArray(quarter) ? quarter : []);

        console.log('✅ Technical data loaded');
      } catch (err) {
        console.error('❌ Error loading technical data:', err);
        setError('Technische data kon niet worden geladen.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // ✅ Haal totale technische score uit daily-scores API
  useEffect(() => {
    async function fetchDailyScore() {
      try {
        const result = await getDailyScores();
        if (result?.technical_score !== undefined) {
          const score = parseFloat(result.technical_score);
          setOverallScore(score);
          setOverallAdvies(
            score >= 70 ? 'Bullish' :
            score <= 40 ? 'Bearish' :
            'Neutral'
          );
        }
      } catch (err) {
        console.error('❌ Error fetching daily technical score:', err);
      }
    }

    fetchDailyScore();
  }, []);

  // ✅ Bereken gemiddelde score van actieve timeframe (voor tab-tabel)
  useEffect(() => {
    const dataMap = {
      day: dayData,
      week: weekData,
      month: monthData,
      quarter: quarterData,
    };

    const activeData = dataMap[activeTab] || [];

    const validScores = activeData
      .map((item) => parseFloat(item.score))
      .filter((s) => !isNaN(s));

    if (validScores.length > 0) {
      const average = validScores.reduce((acc, val) => acc + val, 0) / validScores.length;
      setAvgScore(Number(average.toFixed(2)));

      setAdvies(
        average >= 70 ? 'Bullish' :
        average <= 40 ? 'Bearish' :
        'Neutral'
      );
    } else {
      setAvgScore(null);
      setAdvies('Neutral');
    }
  }, [activeTab, dayData, weekData, monthData, quarterData]);

  // ✅ Verwijder asset uit alle timeframes
  const deleteAsset = (symbol) => {
    if (!symbol) return;
    console.log(`🗑️ Removing ${symbol} from all timeframes`);
    setDayData((prev) => prev.filter((item) => item.symbol !== symbol));
    setWeekData((prev) => prev.filter((item) => item.symbol !== symbol));
    setMonthData((prev) => prev.filter((item) => item.symbol !== symbol));
    setQuarterData((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  return {
    dayData,
    weekData,
    monthData,
    quarterData,
    avgScore,
    advies,
    overallScore,
    overallAdvies,
    loading,
    error,
    deleteAsset,
  };
}
