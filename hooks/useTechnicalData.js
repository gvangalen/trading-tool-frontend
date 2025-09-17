// hooks/useTechnicalData.ts
'use client';

import { useEffect, useState } from 'react';

export function useTechnicalData(timeframe = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [advies, setAdvies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mapping van 'Dag' → 'day'
  const routeMap = {
    Dag: 'day',
    Week: 'week',
    Maand: 'month',
    Kwartaal: 'quarter',
  };

  const route = `/api/technical_data/${routeMap[timeframe] || 'day'}`; // fallback = day

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        console.log('📡 Ophalen van technische data via:', route);
        const res = await fetch(route);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        setTechnicalData(data || []);

        // ⏳ Optioneel: samenvattende score berekenen
        if (Array.isArray(data) && data.length > 0) {
          const validScores = data.map(d => parseFloat(d.score)).filter(s => !isNaN(s));
          const average = validScores.reduce((sum, val) => sum + val, 0) / validScores.length;
          setAvgScore(average.toFixed(2));

          const advies =
            average >= 1.5 ? 'Bullish' :
            average <= -1.5 ? 'Bearish' : 'Neutraal';
          setAdvies(advies);
        } else {
          setAvgScore(null);
          setAdvies('Neutraal');
        }
      } catch (err) {
        console.error('❌ Fout bij ophalen van technische data:', err);
        setError('Technische data kon niet geladen worden.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [route]);

  // Asset verwijderen (optioneel)
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
