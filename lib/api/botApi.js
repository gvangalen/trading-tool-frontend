"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API — FINAL (HARDENED v2)
 * --------------------------------------------------
 * ✅ Alleen API-calls
 * ❌ Geen state
 * ❌ Geen business logic
 *
 * Backend = single source of truth
 */

/* =====================================================
   🛟 Helpers
===================================================== */

const ensureArray = (v) => (Array.isArray(v) ? v : []);
const ensureObject = (v) => (v && typeof v === "object" ? v : {});
const buildQuery = (params) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();

/* =====================================================
   🤖 1. BOT CONFIGS
===================================================== */

export const fetchBotConfigs = async () => {
  const data = await fetchAuth(`/api/bot/configs`, { method: "GET" });
  return ensureArray(data);
};

export const createBotConfig = async ({
  name,
  strategy_id,
  mode = "manual",
  risk_profile = "balanced",
  budget_total_eur = 0,
  budget_daily_limit_eur = 0,
  budget_min_order_eur = 0,
  budget_max_order_eur = 0,
}) => {
  if (!name) throw new Error("Bot naam is verplicht");
  if (!strategy_id) throw new Error("strategy_id is verplicht");

  return await fetchAuth(`/api/bot/configs`, {
    method: "POST",
    body: JSON.stringify({
      name,
      strategy_id,
      mode,
      risk_profile,
      budget_total_eur,
      budget_daily_limit_eur,
      budget_min_order_eur,
      budget_max_order_eur,
    }),
  });
};

export const updateBotConfig = async (bot_id, payload = {}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(`/api/bot/configs/${bot_id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...(payload.name != null && { name: payload.name }),
      ...(payload.mode != null && { mode: payload.mode }),
      ...(payload.risk_profile != null && { risk_profile: payload.risk_profile }),
      ...(payload.is_active != null && { is_active: payload.is_active }),
      ...(payload.budget_total_eur != null && {
        budget_total_eur: payload.budget_total_eur,
      }),
      ...(payload.budget_daily_limit_eur != null && {
        budget_daily_limit_eur: payload.budget_daily_limit_eur,
      }),
      ...(payload.budget_min_order_eur != null && {
        budget_min_order_eur: payload.budget_min_order_eur,
      }),
      ...(payload.budget_max_order_eur != null && {
        budget_max_order_eur: payload.budget_max_order_eur,
      }),
    }),
  });
};

export const deleteBotConfig = async (bot_id) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(`/api/bot/configs/${bot_id}`, {
    method: "DELETE",
  });
};

/* =====================================================
   📄 2. BOT TODAY
===================================================== */
export const fetchBotToday = async () => {
  const data = await fetchAuth(`/api/bot/today`, {
    method: "GET",
  });

  if (!data || typeof data !== "object") return null;

  return {
    ...data,
    scores: ensureObject(data.scores),
    decisions: ensureArray(data.decisions),
    orders: ensureArray(data.orders),
    executions: ensureArray(data.executions),
  };
};

/* =====================================================
   📜 3. BOT HISTORY
===================================================== */
export const fetchBotHistory = async (days = 30) => {
  const query = buildQuery({ days });
  const data = await fetchAuth(`/api/bot/history?${query}`, {
    method: "GET",
  });

  return ensureArray(data);
};

/* =====================================================
   📊 4. BOT PORTFOLIOS
===================================================== */
export const fetchBotPortfolios = async () => {
  const data = await fetchAuth(`/api/bot/portfolios`, {
    method: "GET",
  });

  return ensureArray(data);
};

/* =====================================================
   🔁 5. GENERATE BOT DECISION
===================================================== */
export const generateBotDecision = async ({ bot_id, report_date = null }) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      ...(report_date && { report_date }),
    }),
  });
};

/* =====================================================
   ✅ 6. MARK EXECUTED
===================================================== */
export const markBotExecuted = async ({ bot_id, decision_id }) => {
  if (!bot_id) throw new Error("bot_id is verplicht");
  if (!decision_id) throw new Error("decision_id is verplicht");

  return await fetchAuth(`/api/bot/mark_executed`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      decision_id,
    }),
  });
};

/* =====================================================
   ⏭️ 7. SKIP BOT
===================================================== */
export const skipBotToday = async ({ bot_id, report_date = null }) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(`/api/bot/skip`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      ...(report_date && { report_date }),
    }),
  });
};

/* =====================================================
   📈 8. BOT TRADES
===================================================== */
export const fetchBotTrades = async (bot_id, limit = 50) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const query = buildQuery({ bot_id, limit });

  const data = await fetchAuth(`/api/bot/trades?${query}`, {
    method: "GET",
  });

  return ensureArray(data);
};

/* =====================================================
   📊 9. TRADE PLAN (GET)
===================================================== */
export const fetchTradePlan = async (decision_id) => {
  if (!decision_id) throw new Error("decision_id is verplicht");

  const data = await fetchAuth(`/api/bot/trade-plan/${decision_id}`, {
    method: "GET",
  });

  return ensureObject(data);
};

/* =====================================================
   💾 9B. TRADE PLAN (SAVE / UPSERT)  ✅ NEW
===================================================== */
/**
 * Verwacht backend route:
 * POST /api/bot/trade-plan/{decision_id}
 *
 * Body voorbeeld:
 * {
 *   entry_plan: [{ type: "buy", price: 65000 }],
 *   stop_loss: { price: 61000 },
 *   targets: [{ label: "T1", price: 70000 }],
 *   risk: { rr: 2.1, risk_eur: 50 }
 * }
 */
export const saveTradePlan = async (decision_id, payload = {}) => {
  if (!decision_id) throw new Error("decision_id is verplicht");

  const safePayload = {
    entry_plan: ensureArray(payload.entry_plan),
    stop_loss: ensureObject(payload.stop_loss),
    targets: ensureArray(payload.targets),
    risk: ensureObject(payload.risk),
  };

  const data = await fetchAuth(`/api/bot/trade-plan/${decision_id}`, {
    method: "POST",
    body: JSON.stringify(safePayload),
  });

  return ensureObject(data);
};

/* =====================================================
   🟢 10. MANUAL ORDER
===================================================== */
export const createManualOrder = async ({
  bot_id,
  symbol = "BTC",
  side,
  quantity,
  price,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");
  if (!side) throw new Error("side is verplicht");
  if (quantity == null) throw new Error("quantity is verplicht");
  if (price == null) throw new Error("price is verplicht");

  return await fetchAuth(`/api/orders/manual`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      symbol,
      side,
      quantity,
      price,
    }),
  });
};

/* =====================================================
   📈 11. PORTFOLIO BALANCE HISTORY (GLOBAL)
===================================================== */
export const fetchPortfolioBalanceHistory = async ({
  bucket = "1h",
  limit = 500,
} = {}) => {
  const query = buildQuery({ bucket, limit });

  const data = await fetchAuth(`/api/portfolio/balance-history?${query}`, {
    method: "GET",
  });

  return ensureArray(data);
};

/* =====================================================
   📈 12. PORTFOLIO BALANCE HISTORY (PER BOT)
===================================================== */
export const fetchBotBalanceHistory = async ({
  bot_id,
  bucket = "1h",
  limit = 500,
} = {}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const query = buildQuery({ bot_id, bucket, limit });

  const data = await fetchAuth(`/api/bot/balance-history?${query}`, {
    method: "GET",
  });

  return ensureArray(data);
};
