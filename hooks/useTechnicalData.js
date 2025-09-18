'use client';

import { useState, useEffect } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
} from '@/lib/api/technical';

export function useTechnicalData(activeTab = 'day') {
  const [dayData, setDayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [quarterData, setQuarterData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [advies, setAdvies] = useState('Neutral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError('');

      try {
        console.log('📡 Fetching all technical data...');
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

        console.log('✅ All technical data fetched');
      } catch (err) {
        console.error('❌ Error fetching technical data:', err);
        setError('Technical data could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Gemiddelde en advies berekenen voor actieve timeframe
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
      setAvgScore(Number(average.toFixed(2))); // ✨ number ipv string
      setAdvies(
        average >= 1.5 ? 'Bullish' :
        average <= -1.5 ? 'Bearish' :
        'Neutral'
      );
    } else {
      setAvgScore(null);
      setAdvies('Neutral');
    }
  }, [activeTab, dayData, weekData, monthData, quarterData]);

  const deleteAsset = (symbol) => {
    if (!symbol) return;
    console.log(`🗑️ Remove '${symbol}' from all timeframes`);
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
    loading,
    error,
    deleteAsset,
  };
}
