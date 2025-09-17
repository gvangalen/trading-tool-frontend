'use client';

import { useEffect, useState } from 'react';
import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  technicalDataDelete,
} from '@/lib/api/technical';

export function useTechnicalData(activeTab = 'Dag') {
  const [technicalData, setTechnicalData] = useState({
    Dag: [],
    Week: [],
    Maand: [],
    Kwartaal: [],
  });
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`🚀 useTechnicalData mounted voor tab: ${activeTab}`);
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      let data;
      console.log(`📥 Ophalen technische data voor tab: ${activeTab}`);

      switch (activeTab) {
        case 'Dag':
          data = await technicalDataDay();
          break;
        case 'Week':
          data = await technicalDataWeek();
          break;
        case 'Maand':
          data = await technicalDataMonth();
          break;
        case 'Kwartaal':
          data = await technicalDataQuarter();
          break;
        default:
          data = await technicalDataDay();
      }

      const list = Array.isArray(data) ? data : data?.technical_data || [];

      if (!Array.isArray(list)) {
        console.error('❌ technical_data is geen array:', data);
        throw new Error('technical_data is geen array');
      }

      console.log(`✅ ${activeTab} data succesvol geladen:`, list);

      setTechnicalData((prev) => ({
        ...prev,
        [activeTab]: list,
      }));

      // ❌ Geen scoreberekening uitvoeren
      // updateScore(list);
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
    } catch (err) {
      console.error('❌ Fout bij laden technische data:', err);
      setTechnicalData((prev) => ({
        ...prev,
        [activeTab]: [],
      }));
      setAvgScore('N/A');
      setAdvies('⚖️ Neutraal');
      setError('Fout bij laden technische data');
    } finally {
      setLoading(false);
    }
  }

  // 🔇 Tijdelijk uitgezet
  function updateScore(data) {
    console.log('ℹ️ updateScore is tijdelijk uitgeschakeld');
    // Niks doen
  }

  // 🔇 Tijdelijk uitgezet
  async function deleteAsset(symbol) {
    console.log('ℹ️ deleteAsset is tijdelijk uitgeschakeld:', symbol);
    // Niks doen
  }

  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,
    deleteAsset,
  };
}
