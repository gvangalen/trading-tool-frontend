'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
} from '@/lib/api/technical';

export function useTechnicalData(timeframe = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [advies, setAdvies] = useState('Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔄 Mapping van tab-labels → API keys
  const timeframeKeyMap = {
    Dag: 'day',
    Week: 'week',
    Maand: 'month',
    Kwartaal: 'quarter',
  };

  // 🧭 Mapping van API keys → fetch-functies
  const fetchMap = {
    day: technicalDataDay,
    week: technicalDataWeek,
    month: technicalDataMonth,
    quarter: technicalDataQuarter,
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');

      const key = timeframeKeyMap[timeframe] || 'day';
      const fetchFn = fetchMap[key];

      try {
        console.log(`📡 Ophalen technische data voor '${key}'...`);
        const data = await fetchFn();

        if (!Array.isArray(data)) {
          throw new Error('⚠️ Ongeldig dataformaat');
        }

        console.log('📊 Ontvangen data:', data);
        setTechnicalData(data);

        // ✅ Gemiddelde score berekenen
        const validScores = data
          .map((item) => parseFloat(item.score))
          .filter((s) => !isNaN(s));

        if (validScores.length > 0) {
          const average =
            validScores.reduce((acc, val) => acc + val, 0) / validScores.length;
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
      } catch (err) {
        console.error('❌ Fout bij ophalen technische data:', err);
        setTechnicalData([]);
        setAvgScore(null);
        setAdvies('Neutraal');
        setError('Technische data kon niet geladen worden.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeframe]);

  // 🗑️ Verwijder een specifieke asset (op symbol)
  const deleteAsset = (symbol) => {
    console.log(`🗑️ Verwijder '${symbol}' uit lijst`);
    setTechnicalData((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    deleteAsset,
  };
}
