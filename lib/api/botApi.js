// frontend/api/botApi.js

/**
 * Trading Bot API helper
 * --------------------------------------------------
 * Verantwoordelijk voor:
 * - ophalen bot configs
 * - ophalen bot decisions (today / history)
 * - triggeren bot agent
 * - mark executed / skip (human-in-the-loop)
 *
 * ❌ GEEN business logic
 * ✅ 1-op-1 mapping met backend routes
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/* =====================================================
   🔧 Helper
===================================================== */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // 🔐 user session / cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = "API error";
    try {
      const data = await res.json();
      message = data?.detail || data?.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json();
}

/* =====================================================
   🤖 BOT CONFIGS
===================================================== */
export async function fetchBotConfigs() {
  return apiFetch("/bot/configs");
}

/* =====================================================
   📄 BOT TODAY
===================================================== */
export async function fetchBotToday() {
  return apiFetch("/bot/today");
}

/* =====================================================
   📜 BOT HISTORY
===================================================== */
export async function fetchBotHistory(days = 30) {
  return apiFetch(`/bot/history?days=${days}`);
}

/* =====================================================
   🔁 GENERATE BOT (today / specific date)
===================================================== */
export async function generateBotToday(report_date = null) {
  return apiFetch("/bot/generate/today", {
    method: "POST",
    body: JSON.stringify(
      report_date ? { report_date } : {}
    ),
  });
}

/* =====================================================
   ✅ MARK EXECUTED (human-in-the-loop)
===================================================== */
export async function markBotExecuted({
  bot_id,
  report_date,
  symbol,
  side,
  amount_eur,
  price,
  exchange,
  notes,
}) {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

  return apiFetch("/bot/mark_executed", {
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
}

/* =====================================================
   ⏭️ SKIP TODAY
===================================================== */
export async function skipBotToday({
  bot_id,
  report_date,
  notes,
}) {
  if (!bot_id) {
    throw new Error("bot_id is verplicht");
  }

  return apiFetch("/bot/skip", {
    method: "POST",
    body: JSON.stringify({
      bot_id,
      report_date,
      notes,
    }),
  });
}

/* =====================================================
   ➕ CREATE BOT CONFIG
===================================================== */
export async function createBotConfig({
  name,
  symbol = "BTC",
  mode = "manual",
  active = true,
}) {
  if (!name) {
    throw new Error("Bot name is verplicht");
  }

  return apiFetch("/bot/configs", {
    method: "POST",
    body: JSON.stringify({
      name,
      symbol,
      mode,
      active,
    }),
  });
}
