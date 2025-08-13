'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [dcaSetups, setDcaSetups] = useState([]);
  const [aiSetups, setAiSetups] = useState([]);
  const [manualSetups, setManualSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSetups();
  }, []);

  const loadStrategies = useCallback(async (symbol = '', timeframe = '') => {
    console.log(`🔍 loadStrategies gestart met symbol='${symbol}', timeframe='${timeframe}'`);
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const data = await fetchStrategies(symbol, timeframe);
      const filtered = Array.isArray(data) ? data.filter((s) => s != null) : [];
      setStrategies(filtered);
    } catch (err) {
      console.error('❌ loadStrategies: strategieën laden mislukt:', err);
      setError('❌ Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSetups = async (strategyType = '') => {
    console.log(`🔍 loadSetups gestart met strategyType='${strategyType}'`);
    setError('');
    setSuccessMessage('');
    try {
      const [setupData, strategyData] = await Promise.all([
        fetchSetups(strategyType),
        fetchStrategies(strategyType),
      ]);

      const setupsArray = Array.isArray(setupData) ? setupData : [];
      const strategiesArray = Array.isArray(strategyData) ? strategyData : [];

      // Maak per type een map van bestaande strategieën per setup_id
      const hasStrategy = {
        dca: new Set(),
        ai: new Set(),
        manual: new Set(),
      };

      for (const strat of strategiesArray) {
        if (strat.setup_id && strat.strategy_type) {
          const type = strat.strategy_type;
          if (hasStrategy[type]) {
            hasStrategy[type].add(strat.setup_id);
          }
        }
      }

      // Voeg flags toe aan elke setup
      const enrichedSetups = setupsArray.map((s) => ({
        ...s,
        has_dca_strategy: hasStrategy.dca.has(s.id),
        has_ai_strategy: hasStrategy.ai.has(s.id),
        has_manual_strategy: hasStrategy.manual.has(s.id),
      }));

      // Filter specifieke lijsten voor gebruik in tabs of forms
      const dcaOnly = enrichedSetups.filter((s) => !s.has_dca_strategy);
      const aiOnly = enrichedSetups.filter((s) => !s.has_ai_strategy);
      const manualOnly = enrichedSetups.filter((s) => !s.has_manual_strategy);

      // Opslaan in state
      setSetups(enrichedSetups);
      setDcaSetups(dcaOnly);
      setAiSetups(aiOnly);
      setManualSetups(manualOnly);
    } catch (err) {
      console.error('❌ loadSetups: setups laden mislukt:', err);
      setSetups([]);
      setDcaSetups([]);
      setAiSetups([]);
      setManualSetups([]);
    }
  };

  function getRequiredFields(strategy) {
    if (strategy.strategy_type === 'dca') {
      return ['setup_id', 'setup_name', 'symbol', 'timeframe', 'amount', 'frequency'];
    } else {
      return ['setup_id', 'setup_name', 'symbol', 'timeframe', 'entry', 'targets', 'stop_loss'];
    }
  }

  async function saveStrategy(id, updatedData) {
    const missing = getRequiredFields(updatedData).filter((field) => !updatedData[field]);
    if (missing.length > 0) {
      setError(`❌ Verplichte velden ontbreken: ${missing.join(', ')}`);
      return;
    }

    try {
      await updateStrategy(id, updatedData);
      setSuccessMessage('Strategie opgeslagen.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ saveStrategy mislukt:', err);
      setError('Opslaan mislukt.');
    }
  }

  async function removeStrategy(id) {
    try {
      await deleteStrategy(id);
      setSuccessMessage('Strategie verwijderd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ removeStrategy mislukt:', err);
      setError('Verwijderen mislukt.');
    }
  }

  async function generateStrategyForSetup(setupId, overwrite = false) {
    try {
      const response = await generateStrategy(setupId, overwrite);
      if (response?.task_id) {
        setSuccessMessage(`Celery gestart (Task ID: ${response.task_id})`);
      } else {
        setSuccessMessage('Strategie gegenereerd.');
      }
      await loadStrategies();
    } catch (err) {
      console.error('❌ AI-generatie mislukt:', err);
      setError('Generatie mislukt.');
    }
  }

  async function generateAll() {
    try {
      await generateAllStrategies();
      setSuccessMessage('Alle strategieën opnieuw gegenereerd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ Bulk AI-generatie mislukt:', err);
      setError('Bulkgeneratie mislukt.');
    }
  }

  async function addStrategy(strategyData) {
    const missing = getRequiredFields(strategyData).filter((field) => !strategyData[field]);
    if (missing.length > 0) {
      setError(`❌ Verplichte velden ontbreken: ${missing.join(', ')}`);
      return;
    }

    try {
      await createStrategy(strategyData);
      setSuccessMessage('Strategie toegevoegd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ addStrategy mislukt:', err);
      setError('Toevoegen mislukt.');
    }
  }

  return {
    strategies,
    setups,
    dcaSetups,
    aiSetups,
    manualSetups,
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
