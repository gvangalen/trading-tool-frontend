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
  const [setups, setSetups] = useState([]);          // ALLE setups (onbewerkt)
  const [dcaSetups, setDcaSetups] = useState([]);    // Alleen DCA setups
  const [topSetups, setTopSetups] = useState([]);    // Top setups
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ⬇ Alles één keer laden bij mount
  useEffect(() => {
    loadSetups();
    loadTopSetups();
    loadDcaSetups();
  }, []);

  // ============================================================
  // 🔁 1. ALLE setups ophalen (GEEN filtering)
  // ============================================================
  async function loadSetups() {
    console.log(`🔍 loadSetups gestart`);
    setLoading(true);
    setError('');

    try {
      const data = await fetchSetups();   // ⬅️ GEEN filters meer
      setSetups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ loadSetups fout:', err);
      setError('Kan setups niet laden.');
      setSetups([]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // 🔁 2. Alleen DCA setups ophalen
  // ============================================================
  async function loadDcaSetups() {
    console.log('🔍 loadDcaSetups gestart');
    try {
      const data = await fetchDcaSetups();  
      setDcaSetups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ loadDcaSetups fout:', err);
      setError('Kan DCA setups niet laden.');
      setDcaSetups([]);
    }
  }

  // ============================================================
  // ⭐ 3. Top setups (bijv. 3 nieuwste)
  // ============================================================
  async function loadTopSetups() {
    try {
      const data = await fetchTopSetups();
      setTopSetups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ loadTopSetups fout:', err);
      setTopSetups([]);
    }
  }

  // ============================================================
  // 💾 4. Setup bijwerken
  // ============================================================
  async function saveSetup(id, updatedData) {
    try {
      await updateSetup(id, updatedData);
      setSuccessMessage('Setup succesvol opgeslagen.');
      await loadSetups();
      await loadDcaSetups();
    } catch (err) {
      console.error('❌ saveSetup fout:', err);
      setError('Opslaan mislukt.');
    }
  }

  // ============================================================
  // 🗑 5. Setup verwijderen (nu werkt CASCADE perfect)
  // ============================================================
  async function removeSetup(id) {
    try {
      await deleteSetup(id);
      await loadSetups();
      await loadDcaSetups();
    } catch (err) {
      console.error('❌ removeSetup fout:', err);
      setError('Verwijderen mislukt.');
    }
  }

  // ============================================================
  // 🔍 6. Naam-check
  // ============================================================
  function checkSetupNameExists(name) {
    return setups.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
  }

  // ============================================================
  // 📤 PUBLIC API
  // ============================================================
  return {
    setups,          // ALLE setups - ongefilterd
    dcaSetups,
    topSetups,
    loading,
    error,
    successMessage,
    loadSetups,
    loadDcaSetups,
    loadTopSetups,
    saveSetup,
    removeSetup,
    checkSetupNameExists,
  };
}
