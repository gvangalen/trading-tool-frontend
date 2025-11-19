'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  generateAllStrategies,
  fetchStrategyBySetup,
  fetchTaskStatus,
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

  // =====================================================================
  // 1) Load ALL strategies
  // =====================================================================
  const loadStrategies = useCallback(async (symbol = '', timeframe = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchStrategies(symbol, timeframe);
      const filtered = Array.isArray(data) ? data.filter((s) => s != null) : [];
      setStrategies(filtered);
    } catch (err) {
      console.error('❌ loadStrategies fout:', err);
      setError('❌ Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================================
  // 2) Load setups with strategy flags
  // =====================================================================
  const loadSetups = async (strategyType = '') => {
    setError('');
    try {
      const [setupData, strategyData] = await Promise.all([
        fetchSetups(strategyType),
        fetchStrategies(strategyType),
      ]);

      const setupsArray = Array.isArray(setupData) ? setupData : [];
      const strategiesArray = Array.isArray(strategyData) ? strategyData : [];

      const hasStrategy = {
        dca: new Set(),
        ai: new Set(),
        manual: new Set(),
      };

      for (const strat of strategiesArray) {
        if (strat.setup_id && strat.strategy_type) {
          if (hasStrategy[strat.strategy_type]) {
            hasStrategy[strat.strategy_type].add(strat.setup_id);
          }
        }
      }

      const enrichedSetups = setupsArray.map((s) => ({
        ...s,
        has_dca_strategy: hasStrategy.dca.has(s.id),
        has_ai_strategy: hasStrategy.ai.has(s.id),
        has_manual_strategy: hasStrategy.manual.has(s.id),
      }));

      setSetups(enrichedSetups);
      setDcaSetups(enrichedSetups.filter((s) => !s.has_dca_strategy));
      setAiSetups(enrichedSetups.filter((s) => !s.has_ai_strategy));
      setManualSetups(enrichedSetups.filter((s) => !s.has_manual_strategy));
    } catch (err) {
      console.error('❌ loadSetups fout:', err);
    }
  };

  // =====================================================================
  // 3) SAVE / UPDATE / DELETE
  // =====================================================================
  function getRequiredFields(strategy) {
    if (strategy.strategy_type === 'dca') {
      return ['setup_id', 'setup_name', 'symbol', 'timeframe', 'amount', 'frequency'];
    } else {
      return ['setup_id', 'setup_name', 'symbol', 'timeframe', 'entry', 'targets', 'stop_loss'];
    }
  }

  async function saveStrategy(id, updatedData) {
    try {
      await updateStrategy(id, updatedData);
      setSuccessMessage('Strategie opgeslagen.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ saveStrategy fout:', err);
      setError('Opslaan mislukt.');
    }
  }

  async function removeStrategy(id) {
    try {
      await deleteStrategy(id);
      setSuccessMessage('Strategie verwijderd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ removeStrategy fout:', err);
      setError('Verwijderen mislukt.');
    }
  }

  // =====================================================================
  // 4) AI STRATEGIE GENERATIE MET POLLING 🔥🔥🔥
  // =====================================================================
  async function generateStrategyForSetup(setupId, overwrite = true) {
    setSuccessMessage('');
    setError('');

    try {
      // 1) Start Celery taak
      const res = await generateStrategy(setupId, overwrite);

      if (!res?.task_id) {
        console.warn('⚠️ Geen task_id — directe response?');
        await loadStrategies();
        return;
      }

      const taskId = res.task_id;
      console.log(`📌 Celery task gestart: ${taskId}`);

      // 2) Poll elke 2 seconden tot klaar
      let status = 'PENDING';
      let tries = 0;

      while (status !== 'SUCCESS' && tries < 30) {
        await new Promise((r) => setTimeout(r, 2000));
        const result = await fetchTaskStatus(taskId);

        status = result?.state;
        console.log(`⏳ Poll ${tries} — status: ${status}`);
        tries++;
      }

      if (status !== 'SUCCESS') {
        setError('❌ AI taak niet succesvol afgerond.');
        return;
      }

      // 3) Haal de nieuwe / geüpdatete strategy op
      const updated = await fetchStrategyBySetup(setupId);

      if (updated?.strategy) {
        // voeg toe of update in lijst
        setStrategies((prev) => {
          const other = prev.filter((s) => s.id !== updated.strategy.id);
          return [...other, updated.strategy];
        });
      }

      setSuccessMessage('✅ Strategie gegenereerd!');

    } catch (err) {
      console.error('❌ generateStrategyForSetup fout:', err);
      setError('Generatie mislukt.');
    }
  }

  // =====================================================================
  // 5) BULK GENERATE
  // =====================================================================
  async function generateAll() {
    try {
      await generateAllStrategies();
      await loadStrategies();
      setSuccessMessage('Alle strategieën gegenereerd.');
    } catch (err) {
      console.error('❌ generateAll fout:', err);
      setError('Bulkgeneratie mislukt.');
    }
  }

  async function addStrategy(strategyData) {
    try {
      await createStrategy(strategyData);
      setSuccessMessage('Strategie toegevoegd.');
      await loadStrategies();
    } catch (err) {
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
