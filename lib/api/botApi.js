"use client";

import { fetchAuth } from "@/lib/api/auth";

/**
 * Trading Bot API
 * --------------------------------------------------
 * ✅ Alleen API-calls
 * ❌ Geen state
 * ❌ Geen business logic
 */

/* =====================================================
   🤖 1. BOT CONFIGS
===================================================== */

// Alle bots van user
export const fetchBotConfigs = async () => {
  return await fetchAuth(`/api/bot/configs`, {
    method: "GET",
  });
};

// ➕ Bot aanmaken
export const createBotConfig = async ({
  name,
  symbol = "BTC",
  mode = "manual",
  bot_type,
}) => {
  if (!name) {
    throw new Error("Bot name is verplicht");
  }

  if (!bot_type) {
    throw new Error("bot_type is verplicht");
  }

  return await fetchAuth(`/api/bot/configs`, {
    method: "POST",
    body: JSON.stringify({
      name,
      symbol,
      mode,
      bot_type,
    }),
  });
};

// ✏️ Bot bijwerken
export const updateBotConfig = async (
  bot_id,
  {
    name,
    symbol,
    mode,
    bot_type,
  }
) => {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

  if (!bot_type) {
    throw new Error("bot_type is verplicht");
  }

  return await fetchAuth(`/api/bot/configs/${bot_id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      symbol,
      mode,
      bot_type,
    }),
  });
};

// 🗑 Bot verwijderen
export const deleteBotConfig = async (bot_id) => {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

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
   🔁 4. GENERATE BOT
===================================================== */

export const generateBotToday = async (report_date = null) => {
  return await fetchAuth(`/api/bot/generate/today`, {
    method: "POST",
    body: JSON.stringify(report_date ? { report_date } : {}),
  });
};

/* =====================================================
   ✅ 5. MARK EXECUTED
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
   ⏭️ 6. SKIP BOT
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
