"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
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

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
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

  /* =====================================================
     ➕ CREATE BOT
     strategy_id mag hier WEL
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
          is_active: payload.is_active ?? true,
        });

        await loadConfigs();
        return res;
      } catch (e) {
        console.error("❌ createBot error:", e);
        setError(e?.message ?? "Create bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, create: false }));
      }
    },
    [loadConfigs]
  );

  /* =====================================================
     ✏️ UPDATE BOT
     ❗ strategy_id bewust NIET wijzigen
  ===================================================== */
  const updateBot = useCallback(
    async (bot_id, payload) => {
      setLoading((l) => ({ ...l, update: true }));
      setError(null);

      try {
        const res = await updateBotConfig(bot_id, {
          name: payload.name,
          mode: payload.mode,
          is_active: payload.is_active,
          // ❌ strategy_id NIET meesturen
        });

        await loadConfigs();
        return res;
      } catch (e) {
        console.error("❌ updateBot error:", e);
        setError(e?.message ?? "Update bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, update: false }));
      }
    },
    [loadConfigs]
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
        return res;
      } catch (e) {
        console.error("❌ deleteBot error:", e);
        setError(e?.message ?? "Delete bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, delete: false }));
      }
    },
    [loadConfigs]
  );

  /* =====================================================
     🔁 GENERATE BOT (today)
     ❗ altijd EXPLICIET payload → geen cyclic JSON
  ===================================================== */
  const runBotToday = useCallback(
    async (report_date = null) => {
      setLoading((l) => ({ ...l, generate: true }));
      setError(null);

      try {
        const payload = report_date
          ? { report_date }
          : {};

        const res = await generateBotToday(payload);
        await loadToday();
        await loadHistory(30);
        return res;
      } catch (e) {
        console.error("❌ runBotToday error:", e);
        setError(e?.message ?? "Run bot today failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, generate: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     ✅ EXECUTE BOT
     payload = { bot_id, report_date? }
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
        return res;
      } catch (e) {
        console.error("❌ executeBot error:", e);
        setError(e?.message ?? "Execute bot failed");
        throw e;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     ⏭️ SKIP BOT
     payload = { bot_id, report_date? }
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
  }, [loadConfigs, loadToday, loadHistory]);

  /* =====================================================
     📤 EXPORT
  ===================================================== */
  return {
    /* data */
    configs,
    today,
    history,

    /* loading + error */
    loading,
    error,

    /* refresh helpers */
    refresh: {
      configs: loadConfigs,
      today: loadToday,
      history: loadHistory,
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
