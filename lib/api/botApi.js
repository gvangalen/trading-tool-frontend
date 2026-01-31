"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API — FINAL
 * --------------------------------------------------
 * ✅ Alleen API-calls
 * ❌ Geen state
 * ❌ Geen business logic
 *
 * Backend = single source of truth
 */

/* =====================================================
   🤖 1. BOT CONFIGS
===================================================== */

// Alle bots (configs)
export const fetchBotConfigs = async () => {
  return await fetchAuth(`/api/bot/configs`, {
    method: "GET",
  });
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
===================================================== */

export const fetchBotToday = async () => {
  return await fetchAuth(`/api/bot/today`, {
    method: "GET",
  });
};

/* =====================================================
   📜 3. BOT HISTORY
===================================================== */

export const fetchBotHistory = async (days = 30) => {
  return await fetchAuth(`/api/bot/history?days=${days}`, {
    method: "GET",
  });
};

/* =====================================================
   📊 4. BOT PORTFOLIOS
===================================================== */

export const fetchBotPortfolios = async () => {
  return await fetchAuth(`/api/bot/portfolios`, {
    method: "GET",
  });
};

/* =====================================================
   🔁 5. GENERATE BOT DECISION
===================================================== */

export const generateBotDecision = async ({
  bot_id = null,
  report_date = null,
}) => {
  const payload = {
    ...(bot_id != null && { bot_id }),
    ...(typeof report_date === "string" && { report_date }),
  };

  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   ✅ 6. MARK EXECUTED (MANUAL)
===================================================== */

export const markBotExecuted = async ({
  bot_id,
  report_date = null,
  price = null,
  qty = null,          // ✅ FIX: qty expliciet ondersteunen
  exchange = null,
  notes = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" && { report_date }),
    ...(price != null && { price }),
    ...(qty != null && { qty }),        // ✅ FIX
    ...(exchange && { exchange }),
    ...(notes && { notes }),
  };

  return await fetchAuth(`/api/bot/mark_executed`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   ⏭️ 7. SKIP BOT (TODAY)
===================================================== */

export const skipBotToday = async ({
  bot_id,
  report_date = null,
  notes = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" && { report_date }),
    ...(notes && { notes }),
  };

  return await fetchAuth(`/api/bot/skip`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   📈 8. BOT TRADES
===================================================== */

export const fetchBotTrades = async ({
  bot_id,
  limit = 50,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  return await fetchAuth(
    `/api/bot/trades?bot_id=${bot_id}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};
