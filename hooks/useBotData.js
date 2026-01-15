"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
  fetchBotPortfolios, // 🆕
  generateBotToday,
  markBotExecuted,
  skipBotToday,
  createBotConfig,
  updateBotConfig,
  deleteBotConfig,
} from "@/lib/api/botApi";

/**
 * useBotData
 * --------------------------------------------------
 * Centrale hook voor Trading Bots
 *
 * Model:
 * - Bot = uitvoerder
 * - Strategy = intelligentie
 *
 * ❌ geen business logic
 * ❌ geen interpretatie
 */
export default function useBotData() {
  /* =====================================================
     📦 STATE
  ===================================================== */
  const [configs, setConfigs] = useState([]);
  const [today, setToday] = useState(null); // { date, decisions[], orders[] }
  const [history, setHistory] = useState([]);

  // 🆕 portfolio & budget per bot
  const [portfolios, setPortfolios] = useState([]);

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
    portfolios: false, // 🆕
    generate: false,
    action: false,
    create: false,
    update: false,
    delete: false,
  });

  const [error, setError] = useState(null);

  /* =====================================================
     🔄 LOADERS
  ===================================================== */
  const loadConfigs = useCallback(async () => {
    setLoading((l) => ({ ...l, configs: true }));
    setError(null);

    try {
      const data = await fetchBotConfigs();
      setConfigs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("❌ loadConfigs error:", e);
      setError(e?.message ?? "Load configs failed");
    } finally {
      setLoading((l) => ({ ...l, configs: false }));
    }
  }, []);

  const loadToday = useCallback(async () => {
    setLoading((l) => ({ ...l, today: true }));
    setError(null);

    try {
      const data = await fetchBotToday();
      setToday(data ?? null);
    } catch (e) {
      console.error("❌ loadToday error:", e);
      setError(e?.message ?? "Load today failed");
    } finally {
      setLoading((l) => ({ ...l, today: false }));
    }
  }, []);

  const loadHistory = useCallback(async (days = 30) => {
    setLoading((l) => ({ ...l, history: true }));
    setError(null);

    try {
      const data = await fetchBotHistory(days);
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("❌ loadHistory error:", e);
      setError(e?.message ?? "Load history failed");
    } finally {
      setLoading((l) => ({ ...l, history: false }));
    }
  }, []);

  // 🆕 portfolio / budget loader
  const loadPortfolios = useCallback(async () => {
    setLoading((l) => ({ ...l, portfolios: true }));
    setError(null);

    try {
      const data = await fetchBotPortfolios();
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("❌ loadPortfolios error:", e);
      setError(e?.message ?? "Load portfolios failed");
    } finally {
      setLoading((l) => ({ ...l, portfolios: false }));
    }
  }, []);

  /* =====================================================
     ➕ CREATE BOT
  ===================================================== */
  const createBot = useCallback(
    async (payload) => {
      setLoading((l) => ({ ...l, create: true }));
      setError(null);

      try {
        const res = await createBotConfig({
          name: payload.name,
          strategy_id: payload.strategy_id,
          mode: payload.mode ?? "manual",

          // 🆕 budget
          budget_total_eur: payload.budget_total_eur ?? 0,
          budget_daily_limit_eur: payload.budget_daily_limit_eur ?? 0,
          budget_min_order_eur: payload.budget_min_order_eur ?? 0,
          budget_max_order_eur: payload.budget_max_order_eur ?? 0,
        });

        await loadConfigs();
        await loadPortfolios();
        return res;
      } catch (e) {
        console.error("❌ createBot error:", e);
        setError(e?.message ?? "Create bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, create: false }));
      }
    },
    [loadConfigs, loadPortfolios]
  );

  /* =====================================================
     ✏️ UPDATE BOT
  ===================================================== */
  const updateBot = useCallback(
    async (bot_id, payload) => {
      setLoading((l) => ({ ...l, update: true }));
      setError(null);

      try {
        const res = await updateBotConfig(bot_id, {
          name: payload.name,
          mode: payload.mode,

          // 🆕 budget
          budget_total_eur: payload.budget_total_eur ?? 0,
          budget_daily_limit_eur: payload.budget_daily_limit_eur ?? 0,
          budget_min_order_eur: payload.budget_min_order_eur ?? 0,
          budget_max_order_eur: payload.budget_max_order_eur ?? 0,
        });

        await loadConfigs();
        await loadPortfolios();
        return res;
      } catch (e) {
        console.error("❌ updateBot error:", e);
        setError(e?.message ?? "Update bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, update: false }));
      }
    },
    [loadConfigs, loadPortfolios]
  );

  /* =====================================================
     🗑 DELETE BOT
  ===================================================== */
  const deleteBot = useCallback(
    async (bot_id) => {
      setLoading((l) => ({ ...l, delete: true }));
      setError(null);

      try {
        const res = await deleteBotConfig(bot_id);
        await loadConfigs();
        await loadPortfolios();
        return res;
      } catch (e) {
        console.error("❌ deleteBot error:", e);
        setError(e?.message ?? "Delete bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, delete: false }));
      }
    },
    [loadConfigs, loadPortfolios]
  );

  /* =====================================================
     🔁 GENERATE BOT (today)
  ===================================================== */
  const runBotToday = useCallback(
    async (report_date = null) => {
      setLoading((l) => ({ ...l, generate: true }));
      setError(null);

      try {
        const res = await generateBotToday(report_date);
        await loadToday();
        await loadHistory(30);
        await loadPortfolios(); // 🆕 budget verandert
        return res;
      } catch (e) {
        console.error("❌ runBotToday error:", e);
        setError(e?.message ?? "Run bot today failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, generate: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios]
  );

  /* =====================================================
     ✅ EXECUTE BOT
  ===================================================== */
  const executeBot = useCallback(
    async ({ bot_id, report_date }) => {
      setLoading((l) => ({ ...l, action: true }));
      setError(null);

      try {
        const res = await markBotExecuted({
          bot_id,
          report_date,
        });
        await loadToday();
        await loadHistory(30);
        await loadPortfolios(); // 🆕 ledger update
        return res;
      } catch (e) {
        console.error("❌ executeBot error:", e);
        setError(e?.message ?? "Execute bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios]
  );

  /* =====================================================
     ⏭️ SKIP BOT
  ===================================================== */
  const skipBot = useCallback(
    async ({ bot_id, report_date }) => {
      setLoading((l) => ({ ...l, action: true }));
      setError(null);

      try {
        const res = await skipBotToday({
          bot_id,
          report_date,
        });
        await loadToday();
        await loadHistory(30);
        return res;
      } catch (e) {
        console.error("❌ skipBot error:", e);
        setError(e?.message ?? "Skip bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     🔁 INIT LOAD
  ===================================================== */
  useEffect(() => {
    loadConfigs();
    loadToday();
    loadHistory(30);
    loadPortfolios(); // 🆕
  }, [loadConfigs, loadToday, loadHistory, loadPortfolios]);

  /* =====================================================
     📤 EXPORT
  ===================================================== */
  return {
    /* data */
    configs,
    today,
    history,
    portfolios, // 🆕

    /* loading + error */
    loading,
    error,

    /* refresh helpers */
    refresh: {
      configs: loadConfigs,
      today: loadToday,
      history: loadHistory,
      portfolios: loadPortfolios,
    },

    /* actions */
    createBot,
    updateBot,
    deleteBot,
    runBotToday,
    executeBot,
    skipBot,
  };
}
