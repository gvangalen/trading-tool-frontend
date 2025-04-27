'use client';

import { useEffect, useState } from 'react';
import {
  fetchSetups,
  fetchTopSetups,
  updateSetup,
  deleteSetup,
} from '@/lib/api/setupService';

export function useSetupData() {
  const [setups, setSetups] = useState([]);
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSetups();
    loadTopSetups();
  }, []);

  async function loadSetups() {
    try {
      setLoading(true);
      const data = await fetchSetups();
      setSetups(data || []);
    } catch (err) {
      console.error('❌ Fout bij laden setups:', err);
      setError('Kan setups niet laden.');
    } finally {
      setLoading(false);
    }
  }

  async function loadTopSetups() {
    try {
      const data = await fetchTopSetups();
      setTopSetups(data || []);
    } catch (err) {
      console.error('❌ Fout bij laden top setups:', err);
    }
  }

  async function saveSetup(id, updatedData) {
    try {
      await updateSetup(id, updatedData);
      await loadSetups();
    } catch (err) {
      console.error('❌ Fout bij opslaan setup:', err);
    }
  }

  async function removeSetup(id) {
    try {
      await deleteSetup(id);
      await loadSetups();
    } catch (err) {
      console.error('❌ Fout bij verwijderen setup:', err);
    }
  }

  return {
    setups,
    topSetups,
    loading,
    error,
    loadSetups,
    loadTopSetups,
    saveSetup,
    removeSetup,
  };
}
