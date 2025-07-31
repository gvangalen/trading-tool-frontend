'use client';

import { useState, useEffect } from 'react';
import {
  fetchStrategies,
  fetchSetups,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  generateAllStrategies,
} from '@/lib/api/strategy';

export function useStrategyData() {
  const [strategies, setStrategies] = useState([]);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ Strategieën laden
  async function loadStrategies(asset = '', timeframe = '') {
    setLoading(true);
    setError('');
    try {
      const data = await fetchStrategies(asset, timeframe);
      setStrategies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Strategieën laden mislukt:', err);
      setError('❌ Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Setups laden
  async function loadSetups() {
    try {
      const data = await fetchSetups();
      setSetups(Array.isArray(data?.setups) ? data.setups : []);
    } catch (err) {
      console.error('❌ Setups laden mislukt:', err);
      setSetups([]);
    }
  }

  // ✅ Bepaal vereiste velden per strategy_type
  function getRequiredFields(strategy) {
    if (strategy.strategy_type === 'dca') {
      return ['setup_id', 'setup_name', 'asset', 'timeframe', 'amount', 'frequency'];
    } else {
      return ['setup_id', 'setup_name', 'asset', 'timeframe', 'entry', 'targets', 'stop_loss'];
    }
  }

  // 💾 Strategie bewerken (met validatie)
  async function saveStrategy(id, updatedData) {
    const requiredFields = getRequiredFields(updatedData);
    const missing = requiredFields.filter((field) => !updatedData[field]);

    if (missing.length > 0) {
      const message = `❌ Verplichte velden ontbreken: ${missing.join(', ')}`;
      console.warn(message);
      setError(message);
      return;
    }

    try {
      await updateStrategy(id, updatedData);
      setSuccessMessage('Strategie opgeslagen.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ Strategie opslaan mislukt:', err);
      setError('Opslaan mislukt.');
    }
  }

  // ❌ Strategie verwijderen
  async function removeStrategy(id) {
    try {
      await deleteStrategy(id);
      await loadStrategies();
    } catch (err) {
      console.error('❌ Strategie verwijderen mislukt:', err);
      setError('Verwijderen mislukt.');
    }
  }

  // 🧠 Genereer AI-strategie voor één setup
  async function generateStrategyForSetup(setupId, overwrite = false) {
    try {
      const response = await generateStrategy(setupId, overwrite);

      if (response?.task_id) {
        setSuccessMessage(`Celery gestart (Task ID: ${response.task_id})`);
      } else if (response?.status === 'completed') {
        setSuccessMessage('Strategie overschreven.');
      } else if (Array.isArray(response)) {
        setSuccessMessage(`${response.length} strategieën gegenereerd.`);
      } else {
        setSuccessMessage('Strategie gegenereerd via AI.');
      }

      await loadStrategies();
    } catch (err) {
      console.error('❌ AI-generatie mislukt:', err);
      setError('Strategie genereren mislukt.');
    }
  }

  // 🔁 Genereer AI-strategieën voor alle setups
  async function generateAll() {
    try {
      await generateAllStrategies();
      setSuccessMessage('Alle strategieën opnieuw gegenereerd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ Bulk-generatie mislukt:', err);
      setError('Bulkgeneratie mislukt.');
    }
  }

  // ➕ Handmatig strategie toevoegen (met validatie)
  async function addStrategy(strategyData) {
    const requiredFields = getRequiredFields(strategyData);
    const missing = requiredFields.filter((field) => !strategyData[field]);

    if (missing.length > 0) {
      const message = `❌ Verplichte velden ontbreken: ${missing.join(', ')}`;
      console.warn(message);
      setError(message);
      return;
    }

    try {
      await createStrategy(strategyData);
      setSuccessMessage('Strategie toegevoegd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ Strategie toevoegen mislukt:', err);
      setError('Toevoegen mislukt.');
    }
  }

  return {
    strategies,
    setups,
    loading,
    error,
    successMessage,
    loadStrategies,
    loadSetups,
    saveStrategy,
    removeStrategy,
    generateStrategyForSetup,
    generateAll,
    addStrategy,
  };
}
