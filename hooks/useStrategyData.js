'use client';

import { useState, useEffect } from 'react';
import {
  fetchStrategies,
  fetchSetups,
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  generateAllStrategies,
} from '@/lib/api/strategy'; // ✅ juiste en volledige import

export function useStrategyData() {
  const [strategies, setStrategies] = useState([]);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadStrategies(asset = '', timeframe = '') {
    setLoading(true);
    setError('');
    try {
      const data = await fetchStrategies(asset, timeframe);
      setStrategies(data || []);
    } catch (err) {
      console.error('❌ Strategieën laden mislukt:', err);
      setError('❌ Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadSetups() {
    try {
      const data = await fetchSetups();
      setSetups(data?.setups || []);
    } catch (err) {
      console.error('❌ Setups laden mislukt:', err);
      setSetups([]);
    }
  }

  return {
    strategies,
    setups,
    loading,
    error,
    loadStrategies,
    loadSetups,
    updateStrategy,
    deleteStrategy,
    generateStrategy,
    generateAllStrategies,
  };
}
