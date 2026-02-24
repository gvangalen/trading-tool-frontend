"use client";

import { Wallet, Info } from "lucide-react";

import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";

/**
 * BotPortfolioOverview — READ ONLY
 * --------------------------------------------------
 * ✅ Aggregatie over ALLE bots (zelfde /bot/portfolios data)
 * ✅ Alleen financiële / portfolio data
 * ❌ GEEN status (active / paused)
 * ❌ GEEN acties
 * ✅ Backend = single source of truth
 *
 * Props:
 *  bots: array (zelfde shape als je "bot" object in BotPortfolioSection)
 */
export default function BotPortfolioOverview({ bots = [] }) {
  const list = Array.isArray(bots) ? bots : [];
  if (!list.length) return null;

  // -----------------------------
  // Aggregate helpers
  // -----------------------------
  const sum = (arr, getter) =>
    arr.reduce((acc, x) => acc + (Number(getter(x)) || 0), 0);

  // -----------------------------
  // Budget aggregates
  // -----------------------------
  const totalBudgetEur = sum(list, (b) => b?.budget?.total_eur);
  const totalDailyLimitEur = sum(list, (b) => b?.budget?.daily_limit_eur);
  const totalMaxOrderEur = sum(list, (b) => b?.budget?.max_order_eur);

  // Budget context (mag reserves bevatten)
  const spentTotalForBudget = sum(list, (b) =>
    Math.abs(b?.stats?.net_cash_delta_eur ?? 0)
  );

  const todaySpent = sum(list, (b) => b?.stats?.today_spent_eur);

  const hasBudget =
    totalBudgetEur > 0 || totalDailyLimitEur > 0 || totalMaxOrderEur > 0;

  // -----------------------------
  // Portfolio aggregates (ECHTE TRADES)
  // -----------------------------
  const positionValue = sum(list, (b) => b?.stats?.position_value_eur);

  // ❗ Alleen executed trades (invested)
  const spentExecuted = sum(list, (b) =>
    Math.abs(b?.stats?.net_executed_cash_delta_eur ?? 0)
  );

  const pnlEur = positionValue - spentExecuted;
  const pnlPct = spentExecuted > 0 ? (pnlEur / spentExecuted) * 100 : 0;

  // -----------------------------
  // Symbol breakdown (optioneel, handig bij multi-asset bots)
  // -----------------------------
  const bySymbol = list.reduce((acc, b) => {
    const sym = b?.symbol || "—";
    if (!acc[sym]) {
      acc[sym] = {
        symbol: sym,
        netQty: 0,
        positionValue: 0,
        spentExecuted: 0,
      };
    }

    acc[sym].netQty += Number(b?.stats?.net_qty ?? 0);
    acc[sym].positionValue += Number(b?.stats?.position_value_eur ?? 0);
    acc[sym].spentExecuted += Math.abs(
      Number(b?.stats?.net_executed_cash_delta_eur ?? 0)
    );

    return acc;
  }, {});

  const symbolRows = Object.values(bySymbol).sort(
    (a, b) => b.positionValue - a.positionValue
  );

  return (
    <div className="card-surface p-6 space-y-6">
      {/* =====================
         HEADER
      ===================== */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-dark)]">
            Portfolio — Alle bots
          </h3>
          <p className="text-sm text-[var(--text-light)]">
            Overzicht van budget + posities over al je bots.
          </p>
        </div>

        <div className="text-xs text-[var(--text-muted)]">
          Bots: <span className="font-medium text-[var(--text-dark)]">{list.length}</span>
        </div>
      </div>

      {/* =====================
         BUDGET (READ ONLY)
      ===================== */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-xs text-[var(--text-muted)]">
          <Wallet size={14} className="icon-muted" />
          <span className="font-medium">Totaal budget</span>

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
              label="Alle bots"
              total={totalBudgetEur}
              spent={spentTotalForBudget}
            />

            <div className="text-xs text-[var(--text-muted)] mt-2">
              Vandaag besteed €{Number(todaySpent).toFixed(0)}
              {totalDailyLimitEur
                ? ` · Totale daglimiet €${Number(totalDailyLimitEur).toFixed(0)}`
                : ""}
              {totalMaxOrderEur
                ? ` · Som max/trade €${Number(totalMaxOrderEur).toFixed(0)}`
                : ""}
            </div>
          </>
        ) : (
          <div className="text-xs text-[var(--text-muted)]">Geen budget ingesteld</div>
        )}
      </div>

      {/* =====================
         PORTFOLIO TOTAAL
      ===================== */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <Stat label="Positions">{symbolRows.length}</Stat>

        <Stat label="Totale waarde">€{Number(positionValue).toFixed(0)}</Stat>

        <Stat label="Geïnvesteerd (executed)">
          €{Number(spentExecuted).toFixed(0)}
        </Stat>

        <Stat label="PnL (totaal)">
          <BotPnLBadge pnlEur={pnlEur} pnlPct={pnlPct} />
        </Stat>
      </div>

      {/* =====================
         OPTIONAL: PER SYMBOL
      ===================== */}
      {symbolRows.length > 1 && (
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <div className="text-sm font-semibold text-[var(--text-dark)] mb-2">
            Breakdown per asset
          </div>

          <div className="space-y-2">
            {symbolRows.map((row) => {
              const rowPnl = row.positionValue - row.spentExecuted;
              const rowPct =
                row.spentExecuted > 0 ? (rowPnl / row.spentExecuted) * 100 : 0;

              return (
                <div
                  key={row.symbol}
                  className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--text-dark)] truncate">
                      {row.symbol}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Holdings: {Number(row.netQty).toFixed(6)} {row.symbol}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-[var(--text-dark)]">
                      €{Number(row.positionValue).toFixed(0)}
                    </div>
                    <div className="mt-1">
                      <BotPnLBadge pnlEur={rowPnl} pnlPct={rowPct} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */
function Stat({ label, children }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div className="font-medium text-[var(--text-dark)]">{children}</div>
    </div>
  );
}
