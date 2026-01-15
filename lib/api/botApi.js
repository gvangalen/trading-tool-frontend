"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API
 * --------------------------------------------------
 * ✅ Alleen API-calls
 * ❌ Geen state
 * ❌ Geen business logic
 *
 * Model:
 * - Bot = uitvoerder
 * - Strategy = intelligentie
 */

/* =====================================================
   🤖 1. BOT CONFIGS
===================================================== */

// Alle bots van user (incl. budget)
export const fetchBotConfigs = async () => {
  return await fetchAuth(`/api/bot/configs`, {
    method: "GET",
  });
};

// ➕ Bot aanmaken (MET budget)
export const createBotConfig = async ({
  name,
  strategy_id,
  mode = "manual",

  // 🆕 budget
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

      budget_total_eur,
      budget_daily_limit_eur,
      budget_min_order_eur,
      budget_max_order_eur,
    }),
  });
};

// ✏️ Bot bijwerken (MET budget)
export const updateBotConfig = async (
  bot_id,
  {
    name,
    mode,

    budget_total_eur = 0,
    budget_daily_limit_eur = 0,
    budget_min_order_eur = 0,
    budget_max_order_eur = 0,
  }
) => {
  if (!bot_id) throw new Error("bot_id is verplicht");
  if (!name) throw new Error("Bot naam is verplicht");

  return await fetchAuth(`/api/bot/configs/${bot_id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      mode,

      budget_total_eur,
      budget_daily_limit_eur,
      budget_min_order_eur,
      budget_max_order_eur,
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
   🆕 3b. BOT PORTFOLIOS / BUDGET DASHBOARD
===================================================== */

export const fetchBotPortfolios = async () => {
  return await fetchAuth(`/api/bot/portfolios`, {
    method: "GET",
  });
};

/* =====================================================
   🔁 4. GENERATE BOT (vandaag)
   🔒 HARDENED: alleen YYYY-MM-DD string toegestaan
===================================================== */

export const generateBotToday = async (report_date = null) => {
  const payload =
    typeof report_date === "string"
      ? { report_date }
      : {};

  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   ✅ 5. MARK EXECUTED
   🔒 DEFENSIVE PAYLOAD
===================================================== */

export const markBotExecuted = async ({
  bot_id,
  report_date = null,
  price = null,
  exchange = null,
  notes = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" ? { report_date } : {}),
    ...(price != null ? { price } : {}),
    ...(exchange ? { exchange } : {}),
    ...(notes ? { notes } : {}),
  };

  return await fetchAuth(`/api/bot/mark_executed`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* =====================================================
   ⏭️ 6. SKIP BOT (today)
   🔒 DEFENSIVE PAYLOAD
===================================================== */

export const skipBotToday = async ({
  bot_id,
  report_date = null,
  notes = null,
}) => {
  if (!bot_id) throw new Error("bot_id is verplicht");

  const payload = {
    bot_id,
    ...(typeof report_date === "string" ? { report_date } : {}),
    ...(notes ? { notes } : {}),
  };

  return await fetchAuth(`/api/bot/skip`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
