'use client';

import { useEffect, useState } from 'react';
import {
  fetchSetups,
  fetchTopSetups,
  updateSetup,
  deleteSetup,
} from '@/lib/setupService';

export function useSetupData() {
  const [setups, setSetups] = useState([]);
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 🔁 Initiale load bij mount
  useEffect(() => {
    loadSetups();
    loadTopSetups();
  }, []);

  // 📥 Setuplijst ophalen met explanation fix
  async function loadSetups() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSetups();
      setSetups(
        Array.isArray(data)
          ? data.map((s) => ({
              ...s,
              explanation: s.explanation || '', // ✅ altijd explanation beschikbaar
            }))
          : []
      );
    } catch (err) {
      console.error('❌ Fout bij laden setups:', err);
      setError('Kan setups niet laden.');
      setSetups([]);
    } finally {
      setLoading(false);
    }
  }

  // 🌟 Top setups ophalen (bijv. gesorteerd op score)
  async function loadTopSetups() {
    try {
      const data = await fetchTopSetups();
      setTopSetups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Fout bij laden top setups:', err);
      setTopSetups([]);
    }
  }

  // 💾 Setup opslaan
  async function saveSetup(id, updatedData) {
    try {
      await updateSetup(id, updatedData);
      setSuccessMessage('Setup succesvol opgeslagen.');
      await loadSetups();
    } catch (err) {
      console.error('❌ Fout bij opslaan setup:', err);
      setError('Opslaan mislukt.');
    }
  }

  // ❌ Setup verwijderen
  async function removeSetup(id) {
    try {
      await deleteSetup(id);
      await loadSetups();
    } catch (err) {
      console.error('❌ Fout bij verwijderen setup:', err);
      setError('Verwijderen mislukt.');
    }
  }

  // ✅ Naamcontrole-functie
  function checkSetupNameExists(name) {
    return setups.some((setup) => setup.name.toLowerCase() === name.toLowerCase());
  }

  return {
    setups,
    topSetups,
    loading,
    error,
    successMessage,
    loadSetups,
    reloadSetups: loadSetups, // 🔁 alias toegevoegd
    loadTopSetups,
    saveSetup,
    removeSetup,
    checkSetupNameExists,
  };
}
