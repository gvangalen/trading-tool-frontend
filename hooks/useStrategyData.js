'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  generateStrategy,          // ➜ start AI analyse task
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
  // 1) LOAD STRATEGIES
  // =====================================================================
  const loadStrategies = useCallback(async (symbol = '', timeframe = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchStrategies(symbol, timeframe);
      const filtered = Array.isArray(data) ? data.filter(Boolean) : [];
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
  // 2) LOAD SETUPS + FLAGS
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
          hasStrategy[strat.strategy_type]?.add(strat.setup_id);
        }
      }

      const enriched = setupsArray.map((s) => ({
        ...s,
        has_dca_strategy: hasStrategy.dca.has(s.id),
        has_ai_strategy: hasStrategy.ai.has(s.id),
        has_manual_strategy: hasStrategy.manual.has(s.id),
      }));

      setSetups(enriched);
      setDcaSetups(enriched.filter((s) => !s.has_dca_strategy));
      setAiSetups(enriched.filter((s) => !s.has_ai_strategy));
      setManualSetups(enriched.filter((s) => !s.has_manual_strategy));

    } catch (err) {
      console.error('❌ loadSetups fout:', err);
      setError('Fout bij laden setups.');
    }
  };

  // =====================================================================
  // 3) CRUD
  // =====================================================================
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

  async function addStrategy(strategyData) {
    try {
      await createStrategy(strategyData);
      setSuccessMessage('Strategie toegevoegd.');
      await loadStrategies();
    } catch (err) {
      console.error('❌ addStrategy fout:', err);
      setError('Toevoegen mislukt.');
    }
  }

  // =====================================================================
  // 4) 🧠 AI ANALYSE / ADVIES (GEEN NIEUWE STRATEGY)
  // =====================================================================
  async function generateStrategyForSetup(setupId) {
    setSuccessMessage('');
    setError('');

    try {
      // 1️⃣ Start AI analyse task
      const res = await generateStrategy(setupId);

      if (!res?.task_id) {
        setError('❌ AI taak niet gestart.');
        return;
      }

      const taskId = res.task_id;
      console.log(`🧠 AI analyse gestart: ${taskId}`);

      // 2️⃣ Poll task status
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
        setError('❌ AI analyse mislukt.');
        return;
      }

      // ✅ GEEN nieuwe strategy ophalen
      // ✅ GEEN state-mutatie van strategies
      // Analyse staat nu veilig in DB

      setSuccessMessage('🧠 AI-advies bijgewerkt voor bestaande strategie');

    } catch (err) {
      console.error('❌ AI analyse fout:', err);
      setError('AI analyse mislukt.');
    }
  }

  // =====================================================================
  // 5) BULK (optioneel)
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

  // =====================================================================
  // RETURN
  // =====================================================================
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
    addStrategy,

    generateStrategyForSetup,   // 🔘 knop gebruikt DEZE
    generateAll,
  };
}
