"use client";

import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";
import { Info } from "lucide-react";

/**
 * BotPortfolioSection — READ ONLY
 * --------------------------------------------------
 * Portfolio + Budget info van een bot
 *
 * ❌ GEEN modals
 * ❌ GEEN wijzigen / instellen knop
 * ✅ Alleen tonen van actuele status
 *
 * Budget aanpassen gebeurt via:
 * BotSettingsMenu → Portfolio & budget
 */
export default function BotPortfolioSection({ bot }) {
  if (!bot) return null;

  const {
    symbol,
    status,
    budget = {},
    portfolio,
  } = bot;

  const hasBudget =
    (budget.total_eur ?? 0) > 0 ||
    (budget.daily_limit_eur ?? 0) > 0 ||
    (budget.max_order_eur ?? 0) > 0;

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
              label="Budget"
              total={budget.total_eur}
              spent={
                budget.total_eur -
                (budget.remaining_eur ?? 0)
              }
            />

            <div className="text-xs text-[var(--text-muted)] mt-2">
              Beschikbaar €
              {budget.remaining_eur?.toFixed(0) ?? 0}
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
          {portfolio.units.toFixed(4)} {symbol}
        </Stat>

        <Stat label="Avg entry">
          €{portfolio.avg_entry.toFixed(0)}
        </Stat>

        <Stat label="Cost basis">
          €{portfolio.cost_basis_eur.toFixed(0)}
        </Stat>

        <Stat label="PnL">
          <BotPnLBadge
            pnlEur={portfolio.unrealized_pnl_eur}
            pnlPct={portfolio.unrealized_pnl_pct}
          />
        </Stat>
      </div>

      {/* ===================== */}
      {/* STATUS */}
      {/* ===================== */}
      <div className="pt-3 border-t text-xs flex justify-between">
        <span className="text-[var(--text-muted)]">Status</span>
        <span
          className={
            status === "active"
              ? "icon-success"
              : "text-[var(--text-muted)]"
          }
        >
          {status.toUpperCase()}
        </span>
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
