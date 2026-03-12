"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchBotConfigs,
  fetchBotToday,
  fetchBotHistory,
  fetchBotPortfolios,
  fetchBotTrades,
  fetchTradePlan,
  saveTradePlan,
  generateBotDecision,
  markBotExecuted,
  skipBotToday,
  createBotConfig,
  updateBotConfig,
  deleteBotConfig,
  createManualOrder as apiCreateManualOrder,
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
  const [tradePlans, setTradePlans] = useState({});

  const [loading, setLoading] = useState({
    configs: false,
    today: false,
    history: false,
    portfolios: false,
    trades: false,
    tradePlan: false,
    saveTradePlan: false,
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

  /**
   * ⚠️ BELANGRIJK
   *
   * Backend = single source of truth.
   * We transformeren hier NIET de data.
   *
   * Alleen veilige alias velden voor UI backward compatibility.
   */
  const loadToday = useCallback(async () => {
    setLoading((l) => ({ ...l, today: true }));

    try {

      const data = await fetchBotToday();

      if (data?.decisions) {

        data.decisions = data.decisions.map((d) => {

          const scores = d.scores_json || {};

          return {
            ...d,

            scores_json: scores,

            /**
             * ⚠️ Guardrails contract
             *
             * Backend veld:
             * decision.guardrails_result
             *
             * UI compat:
             * decision.guardrails
             */
            guardrails_result: d.guardrails_result || null,
            guardrails: d.guardrails_result || null,

            /**
             * Backwards compatibility
             */
            requested_amount_eur:
              d.requested_amount_eur ??
              scores.requested_amount_eur ??
              0,

            amount_eur:
              d.amount_eur ??
              scores.amount_eur ??
              0,
          };
        });
      }

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

      if (!bot_id) return;

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
    []
  );

  /* =====================================================
     📊 TRADE PLAN
  ===================================================== */

  const loadTradePlan = useCallback(
    async (decision_id, { force = false } = {}) => {

      if (!decision_id) return;

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
     💾 SAVE TRADE PLAN
  ===================================================== */

  const saveTradePlanForDecision = useCallback(
    async ({ bot_id = null, decision_id, draft }) => {

      if (!decision_id) throw new Error("decision_id is verplicht");

      setLoading((l) => ({ ...l, saveTradePlan: true }));

      try {

        const saved = await saveTradePlan(decision_id, draft);

        const plan = saved?.trade_plan || {};

        setTradePlans((prev) => ({
          ...prev,
          [decision_id]: plan,
        }));

        await Promise.all([
          loadToday(),
          loadPortfolios(),
          ...(bot_id ? [loadTradesForBot(bot_id)] : []),
        ]);

        return plan;

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

        await Promise.all([
          loadConfigs(),
          loadPortfolios(),
          loadToday()
        ]);

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

        await Promise.all([
          loadConfigs(),
          loadPortfolios(),
          loadToday()
        ]);

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

        await Promise.all([
          loadConfigs(),
          loadPortfolios(),
          loadToday()
        ]);

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
    loadTradesForBot,
    loadTradePlan,
    saveTradePlanForDecision,
    createManualOrder: apiCreateManualOrder,
  };

}
