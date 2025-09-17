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

  // 🧭 Mapping voor juiste fetch-functie
  const fetchMap = {
    Dag: technicalDataDay,
    Week: technicalDataWeek,
    Maand: technicalDataMonth,
    Kwartaal: technicalDataQuarter,
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');

      const fetchFn = fetchMap[timeframe] || technicalDataDay;

      try {
        console.log(`📡 Ophalen technische data voor '${timeframe}'...`);
        const data = await fetchFn();

        if (!Array.isArray(data)) {
          throw new Error('⚠️ Ongeldig dataformaat');
        }

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

  // ✅ Item verwijderen op basis van symbol
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
