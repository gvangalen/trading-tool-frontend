// frontend/api/botApi.js

"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API
 * --------------------------------------------------
 * ✅ Zelfde stijl als macro
 * ✅ Altijd via fetchAuth (cookies / session OK)
 * ✅ Geen eigen fetch / headers
 * ❌ Geen business logic
 */

/* =====================================================
   🤖 1. BOT CONFIGS (USER-SPECIFIC)
===================================================== */

// 📌 Alle bots van user
export const fetchBotConfigs = async () => {
  return await fetchAuth(`/api/bot/configs`, {
    method: "GET",
  });
};

// ➕ Bot toevoegen
export const createBotConfig = async ({
  name,
  symbol = "BTC",
  mode = "manual",
  active = true,
}) => {
  if (!name) {
    throw new Error("Bot name is verplicht");
  }

  return await fetchAuth(`/api/bot/configs`, {
    method: "POST",
    body: JSON.stringify({
      name,
      symbol,
      mode,
      active,
    }),
  });
};

/* =====================================================
   📄 2. BOT TODAY (DECISIONS + ORDERS)
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
   🔁 4. GENERATE BOT (TODAY / DATE)
===================================================== */

export const generateBotToday = async (report_date = null) => {
  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify(report_date ? { report_date } : {}),
  });
};

/* =====================================================
   ✅ 5. MARK EXECUTED (HUMAN-IN-THE-LOOP)
===================================================== */

export const markBotExecuted = async ({
  bot_id,
  report_date,
  symbol,
  side,
  amount_eur,
  price,
  exchange,
  notes,
}) => {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

  return await fetchAuth(`/api/bot/mark_executed`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      report_date,
      symbol,
      side,
      amount_eur,
      price,
      exchange,
      notes,
    }),
  });
};

/* =====================================================
   ⏭️ 6. SKIP BOT (TODAY)
===================================================== */

export const skipBotToday = async ({
  bot_id,
  report_date,
  notes,
}) => {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

  return await fetchAuth(`/api/bot/skip`, {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      report_date,
      notes,
    }),
  });
};
