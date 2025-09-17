'use client';

import { useEffect, useState } from 'react';
import {
  fetchTechnicalDataDay,
  fetchTechnicalDataWeek,
  fetchTechnicalDataMonth,
  fetchTechnicalDataQuarter,
} from '@/lib/api/technical'; // ✅ Net als macro

export function useTechnicalData(timeframe = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [advies, setAdvies] = useState('Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMap = {
    Dag: fetchTechnicalDataDay,
    Week: fetchTechnicalDataWeek,
    Maand: fetchTechnicalDataMonth,
    Kwartaal: fetchTechnicalDataQuarter,
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');

      const fetchFn = fetchMap[timeframe] || fetchTechnicalDataDay;

      try {
        console.log(`📡 Ophalen technische data (${timeframe}) via fetchFn...`);
        const data = await fetchFn();

        if (!Array.isArray(data)) throw new Error('Ongeldig formaat');
        setTechnicalData(data);

        // ✅ Gemiddelde score berekenen
        const validScores = data
          .map((d) => parseFloat(d.score))
          .filter((s) => !isNaN(s));

        if (validScores.length > 0) {
          const average = validScores.reduce((a, b) => a + b, 0) / validScores.length;
          setAvgScore(average);
          setAdvies(
            average >= 1.5 ? 'Bullish' :
            average <= -1.5 ? 'Bearish' : 'Neutraal'
          );
        } else {
          setAvgScore(null);
          setAdvies('Neutraal');
        }

      } catch (err) {
        console.error('❌ Fout bij ophalen van technische data:', err);
        setError('Technische data kon niet geladen worden.');
        setTechnicalData([]);
        setAvgScore(null);
        setAdvies('Neutraal');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeframe]);

  const deleteAsset = (symbol) => {
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
