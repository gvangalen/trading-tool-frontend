"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
  fetchBotPortfolios,
  generateBotDecision,
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
 * ❌ geen business logic
 * ❌ geen interpretatie
 * ✅ backend is single source of truth
 */
export default function useBotData() {
  /* =====================================================
     📦 STATE
  ===================================================== */
  const [configs, setConfigs] = useState([]);
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
    portfolios: false,
    generate: false,
    action: false,
    create: false,
    update: false,
    delete: false,
    budget: false,
  });

  const [error, setError] = useState(null);

  /* =====================================================
     🔄 LOADERS
  ===================================================== */
  const loadConfigs = useCallback(async () => {
    setLoading((l) => ({ ...l, configs: true }));
    try {
      const data = await fetchBotConfigs();
      setConfigs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Load configs failed");
    } finally {
      setLoading((l) => ({ ...l, configs: false }));
    }
  }, []);

  const loadToday = useCallback(async () => {
    setLoading((l) => ({ ...l, today: true }));
    try {
      const data = await fetchBotToday();
      setToday(data ?? null);
    } catch (e) {
      setError(e?.message ?? "Load today failed");
    } finally {
      setLoading((l) => ({ ...l, today: false }));
    }
  }, []);

  const loadHistory = useCallback(async (days = 30) => {
    setLoading((l) => ({ ...l, history: true }));
    try {
      const data = await fetchBotHistory(days);
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Load history failed");
    } finally {
      setLoading((l) => ({ ...l, history: false }));
    }
  }, []);

  const loadPortfolios = useCallback(async () => {
    setLoading((l) => ({ ...l, portfolios: true }));
    try {
      const data = await fetchBotPortfolios();
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Load portfolios failed");
    } finally {
      setLoading((l) => ({ ...l, portfolios: false }));
    }
  }, []);

  /* =====================================================
     🧠 DERIVED DATA
  ===================================================== */
  const decisionsByBot = useMemo(() => {
    const map = {};
    (today?.decisions || []).forEach((d) => {
      map[d.bot_id] = d;
    });
    return map;
  }, [today]);

  const ordersByBot = useMemo(() => {
    const map = {};
    (today?.orders || []).forEach((o) => {
      map[o.bot_id] = o;
    });
    return map;
  }, [today]);

  /* =====================================================
     ➕ CREATE / UPDATE / DELETE
  ===================================================== */
  const createBot = useCallback(
    async (payload) => {
      setLoading((l) => ({ ...l, create: true }));
      try {
        const res = await createBotConfig(payload);
        await loadConfigs();
        await loadPortfolios();
        await loadToday();
        return res;
      } finally {
        setLoading((l) => ({ ...l, create: false }));
      }
    },
    [loadConfigs, loadPortfolios, loadToday]
  );

  const updateBot = useCallback(
    async (bot_id, payload) => {
      setLoading((l) => ({ ...l, update: true }));
      try {
        const res = await updateBotConfig(bot_id, payload);
        await loadConfigs();
        await loadPortfolios();
        await loadToday(); // 🔑 CRUCIAAL
        return res;
      } finally {
        setLoading((l) => ({ ...l, update: false }));
      }
    },
    [loadConfigs, loadPortfolios, loadToday]
  );

  const deleteBot = useCallback(
    async (bot_id) => {
      setLoading((l) => ({ ...l, delete: true }));
      try {
        const res = await deleteBotConfig(bot_id);
        await loadConfigs();
        await loadPortfolios();
        await loadToday(); // 🔑 CRUCIAAL
        return res;
      } finally {
        setLoading((l) => ({ ...l, delete: false }));
      }
    },
    [loadConfigs, loadPortfolios, loadToday]
  );

  /* =====================================================
     💰 BOT BUDGET
  ===================================================== */
  const updateBudgetForBot = useCallback(
    async (bot_id, budgetPayload) => {
      if (!bot_id) return;

      setLoading((l) => ({ ...l, budget: true }));
      try {
        const res = await updateBotConfig(bot_id, {
          budget_total_eur: budgetPayload.total_eur,
          budget_daily_limit_eur: budgetPayload.daily_limit_eur,
          budget_min_order_eur: budgetPayload.min_order_eur,
          budget_max_order_eur: budgetPayload.max_order_eur,
        });

        await loadConfigs();
        await loadPortfolios();
        await loadToday();

        return res;
      } finally {
        setLoading((l) => ({ ...l, budget: false }));
      }
    },
    [loadConfigs, loadPortfolios, loadToday]
  );

  /* =====================================================
     🔁 DAILY FLOW
  ===================================================== */
  const generateDecisionForBot = useCallback(
    async ({ bot_id, report_date = null }) => {
      if (!bot_id) return;

      setLoading((l) => ({ ...l, generate: true }));
      try {
        const res = await generateBotDecision({ bot_id, report_date });
        await loadToday();
        await loadHistory(30);
        await loadPortfolios();
        return res;
      } finally {
        setLoading((l) => ({ ...l, generate: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios]
  );

  const executeBot = useCallback(
    async ({ bot_id, report_date }) => {
      setLoading((l) => ({ ...l, action: true }));
      try {
        const res = await markBotExecuted({ bot_id, report_date });
        await loadToday();
        await loadHistory(30);
        await loadPortfolios();
        return res;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios]
  );

  const skipBot = useCallback(
    async ({ bot_id, report_date }) => {
      setLoading((l) => ({ ...l, action: true }));
      try {
        const res = await skipBotToday({ bot_id, report_date });
        await loadToday();
        await loadHistory(30);
        return res;
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory]
  );

  /* =====================================================
     🔁 INIT
  ===================================================== */
  useEffect(() => {
    loadConfigs();
    loadToday();
    loadHistory(30);
    loadPortfolios();
  }, [loadConfigs, loadToday, loadHistory, loadPortfolios]);

  /* =====================================================
     📤 EXPORT
  ===================================================== */
  return {
    configs,
    today,
    history,
    portfolios,

    decisionsByBot,
    ordersByBot,

    loading,
    error,

    createBot,
    updateBot,
    deleteBot,

    updateBudgetForBot,
    generateDecisionForBot,
    executeBot,
    skipBot,
  };
}
