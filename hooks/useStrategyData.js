'use client';
import { useState, useEffect } from 'react';
import {
  fetchStrategies,
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  generateAllStrategies,
  fetchSetups
} from '@/lib/api/strategy'; // ✅ juiste import

export function useStrategyData() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [setups, setSetups] = useState([]);

  async function loadStrategies(asset = '', timeframe = '') {
    try {
      setLoading(true);
      const data = await fetchStrategies(asset, timeframe);
      setStrategies(data || []);
    } catch (err) {
      console.error('❌ Error loading strategies:', err);
      setError('Unable to load strategies.');
    } finally {
      setLoading(false);
    }
  }

  async function loadSetups() {
    try {
      const data = await fetchSetups();
      setSetups(data.setups || []);
    } catch (err) {
      console.error('❌ Error loading setups:', err);
    }
  }

  return {
    strategies,
    setups,
    loadStrategies,
    loadSetups,
    updateStrategy,
    deleteStrategy,
    generateStrategy,
    generateAllStrategies,
    loading,
    error
  };
}
