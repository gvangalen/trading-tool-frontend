"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
  fetchBotPortfolios,
  fetchBotTrades,
  fetchTradePlan,
  saveTradePlan,            // ✅ NEW (SAVE)
  generateBotDecision,
  markBotExecuted,
  skipBotToday,
  createBotConfig,
  updateBotConfig,
  deleteBotConfig,
} from "@/lib/api/botApi";

/**
 * useBotData — FINAL + TRADE PLAN SUPPORT (EDIT/SAVE)
 * --------------------------------------------------
 * ✅ Backend = single source of truth
 * ❌ Geen business logic
 * ✅ Trade plans lazy loaded & cached
 * ✅ Trade plans editable via saveTradePlan
 */

export default function useBotData() {
  /* =====================================================
     📦 STATE
  ===================================================== */

  const [configs, setConfigs] = useState([]);
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [tradesByBot, setTradesByBot] = useState({});

  // ✅ trade plans cache (decision_id -> plan)
  const [tradePlans, setTradePlans] = useState({});

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
    portfolios: false,
    trades: false,
    tradePlan: false,      // ✅ NEW (load plan)
    saveTradePlan: false,  // ✅ NEW (save plan)
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
    try {
      const data = await fetchBotConfigs();
      setConfigs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Configs laden mislukt");
    } finally {
      setLoading((l) => ({ ...l, configs: false }));
    }
  }, []);

  const loadToday = useCallback(async () => {
    setLoading((l) => ({ ...l, today: true }));
    try {
      const data = await fetchBotToday();
      setToday(data ?? null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Today data laden mislukt");
    } finally {
      setLoading((l) => ({ ...l, today: false }));
    }
  }, []);

  const loadHistory = useCallback(async (days = 30) => {
    setLoading((l) => ({ ...l, history: true }));
    try {
      const data = await fetchBotHistory(days);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "History laden mislukt");
    } finally {
      setLoading((l) => ({ ...l, history: false }));
    }
  }, []);

  const loadPortfolios = useCallback(async () => {
    setLoading((l) => ({ ...l, portfolios: true }));
    try {
      const data = await fetchBotPortfolios();
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Portfolios laden mislukt");
    } finally {
      setLoading((l) => ({ ...l, portfolios: false }));
    }
  }, []);

  /* =====================================================
     📈 TRADES
  ===================================================== */

  const loadTradesForBot = useCallback(
    async (bot_id, limit = 50) => {
      if (!bot_id || loading.trades) return;

      setLoading((l) => ({ ...l, trades: true }));
      try {
        const data = await fetchBotTrades(bot_id, limit);
        setTradesByBot((prev) => ({
          ...prev,
          [bot_id]: Array.isArray(data) ? data : [],
        }));
      } catch (err) {
        console.error(err);
        setError(err.message || "Trades laden mislukt");
      } finally {
        setLoading((l) => ({ ...l, trades: false }));
      }
    },
    [loading.trades]
  );

  /* =====================================================
     📊 TRADE PLAN (LOAD + CACHE)
  ===================================================== */

  const loadTradePlan = useCallback(
    async (decision_id, { force = false } = {}) => {
      if (!decision_id) return;

      // voorkom dubbele calls (tenzij force)
      if (!force && tradePlans[decision_id]) return;

      setLoading((l) => ({ ...l, tradePlan: true }));
      try {
        const plan = await fetchTradePlan(decision_id);

        setTradePlans((prev) => ({
          ...prev,
          [decision_id]: plan,
        }));

        return plan;
      } catch (err) {
        console.error("Trade plan load failed", err);
        return null;
      } finally {
        setLoading((l) => ({ ...l, tradePlan: false }));
      }
    },
    [tradePlans]
  );

  /* =====================================================
     💾 TRADE PLAN (SAVE) ✅ NEW
  ===================================================== */

  const saveTradePlanForDecision = useCallback(
    async ({ bot_id = null, decision_id, draft }) => {
      if (!decision_id) throw new Error("decision_id is verplicht");

      setLoading((l) => ({ ...l, saveTradePlan: true }));
      try {
        const saved = await saveTradePlan(decision_id, draft);

        // ✅ update cache direct (zodat UI meteen updated)
        setTradePlans((prev) => ({
          ...prev,
          [decision_id]: saved,
        }));

        // ✅ refresh today/portfolio (als backend decision.trade_plan ook gebruikt)
        await Promise.all([
          loadToday(),
          loadPortfolios(),
          ...(bot_id ? [loadTradesForBot(bot_id)] : []),
        ]);

        return saved;
      } catch (err) {
        console.error("saveTradePlan failed", err);
        setError(err.message || "Trade plan opslaan mislukt");
        throw err;
      } finally {
        setLoading((l) => ({ ...l, saveTradePlan: false }));
      }
    },
    [loadToday, loadPortfolios, loadTradesForBot]
  );

  /* =====================================================
     🧠 DERIVED
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
        await Promise.all([loadConfigs(), loadPortfolios(), loadToday()]);
        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
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
        await Promise.all([loadConfigs(), loadPortfolios(), loadToday()]);
        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
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
        await Promise.all([loadConfigs(), loadPortfolios(), loadToday()]);
        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading((l) => ({ ...l, delete: false }));
      }
    },
    [loadConfigs, loadPortfolios, loadToday]
  );

  /* =====================================================
     🔁 DAILY FLOW
  ===================================================== */

  const generateDecisionForBot = useCallback(
    async ({ bot_id }) => {
      setLoading((l) => ({ ...l, generate: true }));
      try {
        const res = await generateBotDecision({ bot_id });

        // ✅ trade plans cache reset (optioneel maar netjes)
        setTradePlans((prev) => {
          const next = { ...prev };
          // decision ids veranderen vaak; we houden cache, maar je kan ook flushen:
          // return {};
          return next;
        });

        await Promise.all([
          loadToday(),
          loadHistory(30),
          loadPortfolios(),
          loadTradesForBot(bot_id),
        ]);

        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading((l) => ({ ...l, generate: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios, loadTradesForBot]
  );

  /* =====================================================
     ✅ EXECUTE / SKIP
  ===================================================== */

  const executeBot = useCallback(
    async ({ bot_id, decision_id }) => {
      setLoading((l) => ({ ...l, action: true }));
      try {
        const res = await markBotExecuted({ bot_id, decision_id });

        await Promise.all([loadToday(), loadPortfolios(), loadTradesForBot(bot_id)]);

        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadPortfolios, loadTradesForBot]
  );

  const skipBot = useCallback(
    async ({ bot_id }) => {
      setLoading((l) => ({ ...l, action: true }));
      try {
        const res = await skipBotToday({ bot_id });
        await Promise.all([loadToday(), loadHistory(30), loadPortfolios()]);
        return res;
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading((l) => ({ ...l, action: false }));
      }
    },
    [loadToday, loadHistory, loadPortfolios]
  );

  /* =====================================================
     🔁 INIT LOAD
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
    tradesByBot,
    tradePlans,

    decisionsByBot,
    ordersByBot,

    loading,
    error,

    createBot,
    updateBot,
    deleteBot,

    generateDecisionForBot,
    executeBot,
    skipBot,

    loadTradesForBot,
    loadTradePlan,

    // ✅ NEW: save handler voor TradePlanCard
    saveTradePlanForDecision,
  };
}
