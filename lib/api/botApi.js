"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API — FINAL (HARDENED)
 * --------------------------------------------------
 * ✅ Alleen API-calls
 * ❌ Geen state
 * ❌ Geen business logic
 *
 * Backend = single source of truth
 */

/* =====================================================
   🛟 Helpers (crash prevention & future-proof)
===================================================== */

const ensureArray = (v) => (Array.isArray(v) ? v : []);
const ensureObject = (v) => (v && typeof v === "object" ? v : {});

/* =====================================================
   🤖 1. BOT CONFIGS
===================================================== */

// Alle bots (configs)
export const fetchBotConfigs = async () => {
  const data = await fetchAuth(`/api/bot/configs`, { method: "GET" });
  return ensureArray(data);
};

// ➕ Bot aanmaken
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

// ✏️ Bot bijwerken
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

// 🗑 Bot verwijderen
export const deleteBotConfig = async (bot_id) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(`/api/bot/configs/${bot_id}`, {
    method: "DELETE",
  });
};

/* =====================================================
   📄 2. BOT TODAY
   🔥 Hardened + future-proof
===================================================== */

export const fetchBotToday = async () => {
  const data = await fetchAuth(`/api/bot/today`, {
    method: "GET",
  });

  if (!data) return null;

  return {
    ...data,

    scores: ensureObject(data.scores),

    decisions: ensureArray(data.decisions),
    orders: ensureArray(data.orders),
    executions: ensureArray(data.executions),
  };
};

/* =====================================================
   📜 3. BOT HISTORY (DECISIONS)
===================================================== */

export const fetchBotHistory = async (days = 30) => {
  const data = await fetchAuth(`/api/bot/history?days=${days}`, {
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

export const generateBotDecision = async ({
  bot_id,
  report_date = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" && { report_date }),
  };

  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   ✅ 6. MARK EXECUTED (MANUAL EXECUTION)
===================================================== */

export const markBotExecuted = async ({
  bot_id,
  decision_id,
}) => {
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
   ⏭️ 7. SKIP BOT (TODAY)
===================================================== */

export const skipBotToday = async ({
  bot_id,
  report_date = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" && { report_date }),
  };

  return await fetchAuth(`/api/bot/skip`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   📈 8. BOT TRADES (ECHTE UITVOERINGEN)
===================================================== */

export const fetchBotTrades = async (bot_id, limit = 50) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const data = await fetchAuth(
    `/api/bot/trades?bot_id=${bot_id}&limit=${limit}`,
    { method: "GET" }
  );

  return ensureArray(data);
};


/* =====================================================
   📊 9. TRADE PLAN
===================================================== */

export const fetchTradePlan = async (decision_id) => {
  if (!decision_id) throw new Error("decision_id is verplicht");

  const data = await fetchAuth(
    `/api/bot/trade-plan/${decision_id}`,
    { method: "GET" }
  );

  return ensureObject(data);
};
