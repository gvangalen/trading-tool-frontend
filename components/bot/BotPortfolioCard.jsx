"use client";

import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";
import { Info } from "lucide-react";

/**
 * BotPortfolioSection — READ ONLY (FINAL)
 * --------------------------------------------------
 * ✅ Gebaseerd op /bot/portfolios API
 * ✅ Alleen financiële / portfolio data
 * ❌ GEEN status (active / paused)
 * ❌ GEEN acties
 * ✅ Backend = single source of truth
 */
export default function BotPortfolioSection({ bot }) {
  if (!bot) return null;

  const {
    symbol = "—",
    budget = {},
    stats = {},
  } = bot;

  const hasBudget =
    (budget.total_eur ?? 0) > 0 ||
    (budget.daily_limit_eur ?? 0) > 0 ||
    (budget.max_order_eur ?? 0) > 0;

  const netQty = stats.net_qty ?? 0;
  const positionValue = stats.position_value_eur ?? 0;
  const spentTotal = Math.abs(stats.net_cash_delta_eur ?? 0);
  const todaySpent = stats.today_spent_eur ?? 0;

  return (
    <div className="space-y-5">
      {/* ===================== */}
      {/* BUDGET (READ ONLY) */}
      {/* ===================== */}
      <div>
        <div className="flex items-center gap-1 mb-2 text-xs text-[var(--text-muted)]">
          💰 Bot budget
          <span
            title="Budget wordt ingesteld via bot-instellingen"
            className="cursor-help"
          >
            <Info size={13} className="icon-muted" />
          </span>
        </div>

        {hasBudget ? (
          <>
            <BotBudgetBar
              label="Totaal budget"
              total={budget.total_eur ?? 0}
              spent={spentTotal}
            />

            <div className="text-xs text-[var(--text-muted)] mt-2">
              Vandaag besteed €{todaySpent.toFixed(0)}
              {budget.daily_limit_eur
                ? ` · Daglimiet €${budget.daily_limit_eur}`
                : ""}
              {budget.max_order_eur
                ? ` · Max per trade €${budget.max_order_eur}`
                : ""}
            </div>
          </>
        ) : (
          <div className="text-xs text-[var(--text-muted)]">
            Geen budget ingesteld
          </div>
        )}
      </div>

      {/* ===================== */}
      {/* PORTFOLIO */}
      {/* ===================== */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <Stat label="Holdings">
          {netQty.toFixed(6)} {symbol}
        </Stat>

        <Stat label="Waarde">
          €{positionValue.toFixed(0)}
        </Stat>

        <Stat label="Net cash">
          €{spentTotal.toFixed(0)}
        </Stat>

        <Stat label="PnL">
          <BotPnLBadge
            pnlEur={positionValue - spentTotal}
            pnlPct={
              spentTotal > 0
                ? ((positionValue - spentTotal) / spentTotal) * 100
                : 0
            }
          />
        </Stat>
      </div>
    </div>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */
function Stat({ label, children }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-muted)]">
        {label}
      </div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
