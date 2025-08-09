'use client';

import { useState, useEffect } from 'react';
import {
  fetchStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  generateAllStrategies,
} from '@/lib/api/strategy';
import { fetchSetups } from '@/lib/api/setups';

export function useStrategyData() {
  const [strategies, setStrategies] = useState([]);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initieel setups laden
  useEffect(() => {
    console.log('🚀 useStrategyData mounted: setups laden gestart');
    loadSetups();
  }, []);

  async function loadStrategies(asset = '', timeframe = '') {
    console.log(`🔍 loadStrategies gestart met asset='${asset}', timeframe='${timeframe}'`);
    setLoading(true);
    setError('');
    try {
      const data = await fetchStrategies(asset, timeframe);
      console.log('✅ loadStrategies: data ontvangen', data);
      setStrategies(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ loadStrategies: lege lijst ontvangen');
      }
    } catch (err) {
      console.error('❌ loadStrategies: strategieën laden mislukt:', err);
      setError('❌ Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
      console.log('ℹ️ loadStrategies: klaar');
    }
  }

  async function loadSetups(strategyType = '') {
    console.log(`🔍 loadSetups gestart met strategyType='${strategyType}'`);
    try {
      const data = await fetchSetups(strategyType);
      console.log('✅ loadSetups: data ontvangen', data);
      setSetups(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ loadSetups: lege lijst ontvangen');
      }
    } catch (err) {
      console.error('❌ loadSetups: setups laden mislukt:', err);
      setSetups([]);
    } finally {
      console.log('ℹ️ loadSetups: klaar');
    }
  }

  function getRequiredFields(strategy) {
    if (strategy.strategy_type === 'dca') {
      return ['setup_id', 'setup_name', 'asset', 'timeframe', 'amount', 'frequency'];
    } else {
      return ['setup_id', 'setup_name', 'asset', 'timeframe', 'entry', 'targets', 'stop_loss'];
    }
  }

  async function saveStrategy(id, updatedData) {
    console.log(`💾 saveStrategy gestart voor ID ${id} met data:`, updatedData);
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
      console.log('✅ saveStrategy: strategie succesvol opgeslagen, laden strategieën');
      await loadStrategies();
    } catch (err) {
      console.error('❌ saveStrategy: strategie opslaan mislukt:', err);
      setError('Opslaan mislukt.');
    }
  }

  async function removeStrategy(id) {
    console.log(`🗑️ removeStrategy gestart voor ID ${id}`);
    try {
      await deleteStrategy(id);
      console.log('✅ removeStrategy: strategie succesvol verwijderd, laden strategieën');
      await loadStrategies();
    } catch (err) {
      console.error('❌ removeStrategy: strategie verwijderen mislukt:', err);
      setError('Verwijderen mislukt.');
    }
  }

  async function generateStrategyForSetup(setupId, overwrite = false) {
    console.log(`🤖 generateStrategyForSetup gestart voor setupId ${setupId}, overwrite=${overwrite}`);
    try {
      const response = await generateStrategy(setupId, overwrite);
      console.log('✅ generateStrategyForSetup: response ontvangen', response);

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
      console.error('❌ generateStrategyForSetup: AI-generatie mislukt:', err);
      setError('Strategie genereren mislukt.');
    }
  }

  async function generateAll() {
    console.log('🔁 generateAll gestart');
    try {
      await generateAllStrategies();
      setSuccessMessage('Alle strategieën opnieuw gegenereerd.');
      console.log('✅ generateAll: bulk generatie succesvol, laden strategieën');
      await loadStrategies();
    } catch (err) {
      console.error('❌ generateAll: bulk-generatie mislukt:', err);
      setError('Bulkgeneratie mislukt.');
    }
  }

  async function addStrategy(strategyData) {
    console.log('➕ addStrategy gestart met data:', strategyData);
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
      console.log('✅ addStrategy: strategie toegevoegd, laden strategieën');
      await loadStrategies();
    } catch (err) {
      console.error('❌ addStrategy: strategie toevoegen mislukt:', err);
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
