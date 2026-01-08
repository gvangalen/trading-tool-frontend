// frontend/hooks/useBotData.js
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
  generateBotToday,
  markBotExecuted,
  skipBotToday,
  createBotConfig, // ✅ moet bestaan in botApi.js
} from "@lib/api/botApi";

/**
 * useBotData
 * --------------------------------------------------
 * Centrale hook voor Trading Bot data
 *
 * Verantwoordelijk voor:
 * - bot configs
 * - bot decisions (today)
 * - bot history
 * - create / generate / execute / skip flows
 *
 * ❌ GEEN business logic
 * ✅ Alleen state + API orchestration
 */
export default function useBotData() {
  /* =====================================================
     📦 STATE
  ===================================================== */
  const [configs, setConfigs] = useState([]);
  const [today, setToday] = useState(null); // { date, decisions[], orders[] }
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
    generate: false,
    action: false,
    create: false, // ✅ extra loader voor create
  });

  const [error, setError] = useState(null);

  /* =====================================================
     🔄 LOADERS
  ===================================================== */
  const loadConfigs = useCallback(async () => {
    setLoading((l) => ({ ...l, configs: true }));
    try {
      const data = await fetchBotConfigs();
      setConfigs(data || []);
    } catch (e) {
      console.error("❌ loadConfigs error:", e);
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, configs: false }));
    }
  }, []);

  const loadToday = useCallback(async () => {
    setLoading((l) => ({ ...l, today: true }));
    try {
      const data = await fetchBotToday();
      setToday(data || null);
    } catch (e) {
      console.error("❌ loadToday error:", e);
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, today: false }));
    }
  }, []);

  const loadHistory = useCallback(async (days = 30) => {
    setLoading((l) => ({ ...l, history: true }));
    try {
      const data = await fetchBotHistory(days);
      setHistory(data || []);
    } catch (e) {
      console.error("❌ loadHistory error:", e);
      setError(e.message);
    } finally {
      setLoading((l) => ({ ...l, history: false }));
    }
  }, []);

  /* =====================================================
     ➕ CREATE BOT
     - POST /bot/configs
     - refresh configs list
  ===================================================== */
  const createBot = useCallback(
    async (payload) => {
      setLoading((l) => ({ ...l, create: true }));
      setError(null);

      try {
        const res = await createBotConfig(payload);

        // 🔁 refresh bot list meteen
        await loadConfigs();

        return res;
      } catch (e) {
        console.error("❌ createBot error:", e);
        setError(e.message);
        throw e;
      } finally {
        setLoading((l) => ({ ...l, create: false }));
      }
    },
    [loadConfigs]
  );

  /* =====================================================
     🔁 GENERATE
  ===================================================== */
  const runBotToday = useCallback(
    async (report_date = null) => {
      setLoading((l) => ({ ...l, generate: true }));
      setError(null);

      try {
        const res = await generateBotToday(report_date);

        // Celery queued → polling later mogelijk
        if (res?.queued) {
          console.info("🕒 Bot queued via Celery", res.task_id);
        }

        // Direct refresh
        await loadToday();
        await loadHistory(30);

        return res;
      } catch (e) {
        console.error("❌ runBotToday error:", e);
        setError(e.message);
        throw e;
      } finally {
        setLoading((l) => ({ ...l, generate: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     ✅ EXECUTE (human-in-the-loop)
  ===================================================== */
  const executeBot = useCallback(
    async (payload) => {
      setLoading((l) => ({ ...l, action: true }));
      setError(null);

      try {
        const res = await markBotExecuted(payload);

        await loadToday();
        await loadHistory(30);

        return res;
      } catch (e) {
        console.error("❌ executeBot error:", e);
        setError(e.message);
        throw e;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     ⏭️ SKIP
  ===================================================== */
  const skipBot = useCallback(
    async (payload) => {
      setLoading((l) => ({ ...l, action: true }));
      setError(null);

      try {
        const res = await skipBotToday(payload);

        await loadToday();
        await loadHistory(30);

        return res;
      } catch (e) {
        console.error("❌ skipBot error:", e);
        setError(e.message);
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
  }, [loadConfigs, loadToday, loadHistory]);

  /* =====================================================
     📤 EXPORT
  ===================================================== */
  return {
    /* data */
    configs,
    today,
    history,

    /* loading */
    loading,
    error,

    /* actions */
    refresh: {
      configs: loadConfigs,
      today: loadToday,
      history: loadHistory,
    },

    createBot, // ✅ nieuw
    runBotToday,
    executeBot,
    skipBot,
  };
}
