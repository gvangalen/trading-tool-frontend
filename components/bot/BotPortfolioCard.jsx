// components/bot/BotPortfolioCard.jsx
"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";

export default function BotPortfolioCard({ bot }) {
  if (!bot) return null;

  const {
    bot_name,
    symbol,
    budget,
    portfolio,
    status,
  } = bot;

  return (
    <CardWrapper title={bot_name} subtitle={symbol}>
      <div className="space-y-4 text-sm">

        {/* ===== BUDGET ===== */}
        <div>
          <BotBudgetBar
            label="Dagbudget"
            total={budget.daily_limit_eur}
            spent={budget.spent_today_eur}
          />
        </div>

        {/* ===== PORTFOLIO ===== */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Holdings
            </div>
            <div className="font-medium">
              {portfolio.units.toFixed(4)} {symbol}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Avg entry
            </div>
            <div className="font-medium">
              €{portfolio.avg_entry.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Cost basis
            </div>
            <div className="font-medium">
              €{portfolio.cost_basis_eur.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">
              PnL
            </div>
            <BotPnLBadge
              pnlEur={portfolio.unrealized_pnl_eur}
              pnlPct={portfolio.unrealized_pnl_pct}
            />
          </div>
        </div>

        {/* ===== STATUS ===== */}
        <div className="pt-2 border-t text-xs flex justify-between">
          <span className="text-[var(--text-muted)]">
            Status
          </span>
          <span
            className={
              status === "active"
                ? "text-green-600"
                : "text-[var(--text-muted)]"
            }
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
