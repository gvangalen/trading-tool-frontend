'use client';
import { useState, useEffect } from 'react';
import { fetchStrategieën, updateStrategie, deleteStrategie, generateStrategie, generateAllStrategieën, fetchSetups } from '@/lib/api';

export function useStrategieData() {
  const [strategieën, setStrategieën] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [setups, setSetups] = useState([]);

  async function loadStrategieën(asset = '', timeframe = '') {
    try {
      setLoading(true);
      const data = await fetchStrategieën(asset, timeframe);
      setStrategieën(data || []);
    } catch (err) {
      console.error('❌ Fout bij laden strategieën:', err);
      setError('Kan strategieën niet laden.');
    } finally {
      setLoading(false);
    }
  }

  async function loadSetups() {
    try {
      const data = await fetchSetups();
      setSetups(data.setups || []);
    } catch (err) {
      console.error('❌ Fout bij laden setups:', err);
    }
  }

  return {
    strategieën,
    setups,
    loadStrategieën,
    loadSetups,
    updateStrategie,
    deleteStrategie,
    generateStrategie,
    generateAllStrategieën,
    loading,
    error
  };
}
