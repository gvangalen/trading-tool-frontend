"use client";

import { Wallet, Info } from "lucide-react";

import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";

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

  // =====================================================
  // ✅ BACKEND-LED STATS
  // =====================================================
  const netQty = stats.net_qty ?? 0;
  const positionValue = stats.position_value_eur ?? 0;

  // ❗ Alleen ECHTE trades (execute)
  const spentExecuted = Math.abs(
    stats.net_executed_cash_delta_eur ?? 0
  );

  // Budget context (mag reserves bevatten)
  const spentTotalForBudget = Math.abs(
    stats.net_cash_delta_eur ?? 0
  );

  const todaySpent = stats.today_spent_eur ?? 0;

  return (
    <div className="space-y-6">

      {/* =====================
         BUDGET (READ ONLY)
      ===================== */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-xs text-[var(--text-muted)]">
          <Wallet size={14} className="icon-muted" />
          <span className="font-medium">Bot budget</span>

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
              spent={spentTotalForBudget}
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

      {/* =====================
         PORTFOLIO (ECHTE TRADES)
      ===================== */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <Stat label="Holdings">
          {netQty.toFixed(6)} {symbol}
        </Stat>

        <Stat label="Waarde">
          €{positionValue.toFixed(0)}
        </Stat>

        <Stat label="Geïnvesteerd">
          €{spentExecuted.toFixed(0)}
        </Stat>

        <Stat label="PnL">
          <BotPnLBadge
            pnlEur={positionValue - spentExecuted}
            pnlPct={
              spentExecuted > 0
                ? ((positionValue - spentExecuted) / spentExecuted) * 100
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
      <div className="font-medium">
        {children}
      </div>
    </div>
  );
}
