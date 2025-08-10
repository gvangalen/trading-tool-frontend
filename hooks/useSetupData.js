'use client';

import { useEffect, useState } from 'react';
import {
  fetchSetups,
  fetchTopSetups,
  updateSetup,
  deleteSetup,
  fetchDcaSetups,
} from '@/lib/api/setups';

export function useSetupData() {
  const [setups, setSetups] = useState([]);
  const [dcaSetups, setDcaSetups] = useState([]);
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initial load bij mount (zonder filter)
  useEffect(() => {
    console.log('🚀 useSetupData mounted: laden van setups, top setups en DCA setups gestart');
    loadSetups();
    loadTopSetups();
    loadDcaSetups();
  }, []);

  // Setuplijst ophalen (generiek)
  async function loadSetups(strategyType = '') {
    console.log(`🔍 loadSetups gestart met strategyType='${strategyType}'`);
    setLoading(true);
    setError('');
    try {
      const data = await fetchSetups(strategyType);
      console.log('✅ loadSetups: data ontvangen', data);
      setSetups(
        Array.isArray(data)
          ? data.map((s) => ({
              ...s,
              explanation: s.explanation || '',
            }))
          : []
      );
    } catch (err) {
      console.error('❌ loadSetups: fout bij laden setups:', err);
      setError('Kan setups niet laden.');
      setSetups([]);
    } finally {
      setLoading(false);
      console.log('ℹ️ loadSetups: klaar');
    }
  }

  // Alleen DCA setups ophalen
  async function loadDcaSetups() {
    console.log('🔍 loadDcaSetups gestart');
    setError('');
    try {
      const data = await fetchDcaSetups();
      console.log('✅ loadDcaSetups: data ontvangen', data);
      setDcaSetups(
        Array.isArray(data)
          ? data.map((s) => ({
              ...s,
              explanation: s.explanation || '',
            }))
          : []
      );
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ loadDcaSetups: lege lijst ontvangen');
      }
    } catch (err) {
      console.error('❌ loadDcaSetups: fout bij laden DCA setups:', err);
      setError('Kan DCA setups niet laden.');
      setDcaSetups([]);
    } finally {
      console.log('ℹ️ loadDcaSetups: klaar');
    }
  }

  // Top setups ophalen
  async function loadTopSetups() {
    console.log('🔍 loadTopSetups gestart');
    try {
      const data = await fetchTopSetups();
      console.log('✅ loadTopSetups: data ontvangen', data);
      setTopSetups(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ loadTopSetups: lege lijst ontvangen');
      }
    } catch (err) {
      console.error('❌ loadTopSetups: fout bij laden top setups:', err);
      setTopSetups([]);
    } finally {
      console.log('ℹ️ loadTopSetups: klaar');
    }
  }

  // Setup opslaan
  async function saveSetup(id, updatedData) {
    console.log(`💾 saveSetup gestart voor ID ${id} met data:`, updatedData);
    try {
      await updateSetup(id, updatedData);
      setSuccessMessage('Setup succesvol opgeslagen.');
      console.log('✅ saveSetup: setup succesvol opgeslagen, laden setups en dca setups');
      await loadSetups();
      await loadDcaSetups();
    } catch (err) {
      console.error('❌ saveSetup: fout bij opslaan setup:', err);
      setError('Opslaan mislukt.');
    }
  }

  // Setup verwijderen
  async function removeSetup(id) {
    console.log(`🗑️ removeSetup gestart voor ID ${id}`);
    try {
      await deleteSetup(id);
      console.log('✅ removeSetup: setup succesvol verwijderd, laden setups en dca setups');
      await loadSetups();
      await loadDcaSetups();
    } catch (err) {
      console.error('❌ removeSetup: fout bij verwijderen setup:', err);
      setError('Verwijderen mislukt.');
    }
  }

  // Naamcontrole
  function checkSetupNameExists(name) {
    return setups.some((setup) => setup.name.toLowerCase() === name.toLowerCase());
  }

  return {
    setups,
    dcaSetups,
    topSetups,
    loading,
    error,
    successMessage,
    loadSetups,
    loadDcaSetups,
    reloadSetups: loadSetups,
    loadTopSetups,
    saveSetup,
    removeSetup,
    checkSetupNameExists,
  };
}