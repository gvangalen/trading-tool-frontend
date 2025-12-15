'use client';

import { useState, useEffect, useCallback } from 'react';

import {
  fetchStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  analyzeStrategy,        // ✅ strategy-level AI analyse
  generateAllStrategies,
} from '@/lib/api/strategy';

import { fetchSetups } from '@/lib/api/setups';


// =====================================================================
// 🧠 STRATEGY DATA HOOK (V1)
// =====================================================================
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
      setStrategies(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (err) {
      console.error('❌ loadStrategies fout:', err);
      setError('Fout bij laden strategieën.');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================================
  // 2) LOAD SETUPS + FLAGS
  // =====================================================================
  const loadSetups = async () => {
    setError('');

    try {
      const [setupData, strategyData] = await Promise.all([
        fetchSetups(),
        fetchStrategies(),
      ]);

      const setupsArray = Array.isArray(setupData) ? setupData : [];
      const strategiesArray = Array.isArray(strategyData) ? strategyData : [];

      const hasStrategy = {
        dca: new Set(),
        trading: new Set(),
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
        has_ai_strategy: hasStrategy.trading.has(s.id),
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
  // 4) 🧠 AI STRATEGIE-ANALYSE (V1 – zoals setup)
  // Backend: POST /api/strategies/analyze/{strategy_id}
  // → AI schrijft strategy.data.ai_explanation
  // → wij reloaden strategies
  // =====================================================================
  async function analyzeSingleStrategy(strategyId) {
    setSuccessMessage('');
    setError('');

    if (!strategyId) {
      setError('Geen strategie geselecteerd.');
      return;
    }

    try {
      await analyzeStrategy(strategyId);
      await loadStrategies();
      setSuccessMessage('🧠 AI-uitleg bijgewerkt');
    } catch (err) {
      console.error('❌ AI analyse fout:', err);
      setError('AI analyse mislukt.');
    }
  }

  // =====================================================================
  // 5) BULK STRATEGY GENERATION (OPTIONEEL)
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

    analyzeSingleStrategy,   // ✅ koppel hierop in UI
    generateAll,
  };
}
