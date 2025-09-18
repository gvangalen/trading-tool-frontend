'use client';

import { useState, useEffect } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
} from '@/lib/api/technical';

export function useTechnicalData(activeTab = 'Dag') {
  const [dayData, setDayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [quarterData, setQuarterData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [advies, setAdvies] = useState('Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError('');

      try {
        console.log('📡 Ophalen technische data (alle timeframes)...');

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

        console.log('✅ Alle technische data opgehaald');

      } catch (err) {
        console.error('❌ Fout bij ophalen technische data:', err);
        setError('Technische data kon niet geladen worden.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  useEffect(() => {
    // 🎯 Bepaal score op basis van actieve tab
    const dataMap = {
      Dag: dayData,
      Week: weekData,
      Maand: monthData,
      Kwartaal: quarterData,
    };

    const activeData = dataMap[activeTab] || [];

    const validScores = activeData
      .map((item) => parseFloat(item.score))
      .filter((s) => !isNaN(s));

    if (validScores.length > 0) {
      const average = validScores.reduce((acc, val) => acc + val, 0) / validScores.length;
      setAvgScore(average.toFixed(2));
      setAdvies(
        average >= 1.5 ? 'Bullish' :
        average <= -1.5 ? 'Bearish' :
        'Neutraal'
      );
    } else {
      setAvgScore(null);
      setAdvies('Neutraal');
    }
  }, [activeTab, dayData, weekData, monthData, quarterData]);

  const deleteAsset = (symbol) => {
    console.log(`🗑️ Verwijder '${symbol}' uit alle timeframes`);
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
