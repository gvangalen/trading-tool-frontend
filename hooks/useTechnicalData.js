// hooks/useTechnicalData.ts
'use client';

import { useEffect, useState } from 'react';

export function useTechnicalData(timeframe = 'Dag') {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [advies, setAdvies] = useState<string>('Neutraal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const routeMap: Record<string, string> = {
    Dag: 'day',
    Week: 'week',
    Maand: 'month',
    Kwartaal: 'quarter',
  };

  const apiRoute = `/api/technical_data/${routeMap[timeframe] || 'day'}`;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        console.log('📡 Ophalen van technische data via:', apiRoute);
        const res = await fetch(apiRoute);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error('Ongeldig formaat');

        setTechnicalData(data);

        // ✅ Score samenvatting
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
  }, [timeframe]); // ✅ Let op: NIET 'route' als dependency gebruiken

  // 🔁 Asset verwijderen uit lijst
  const deleteAsset = (symbol: string) => {
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
