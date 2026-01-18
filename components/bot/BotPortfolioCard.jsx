"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";
import { useModal } from "@/components/modal/ModalProvider";

/**
 * BotPortfolioCard
 * --------------------------------------------------
 * Volledig werkende portfolio + budget card
 *
 * Props:
 * - bot: bot portfolio object (uit /api/bot/portfolios)
 * - onUpdateBudget: (bot_id, payload) => Promise
 */
export default function BotPortfolioCard({ bot, onUpdateBudget }) {
  const { openConfirm, showSnackbar } = useModal();
  if (!bot) return null;

  const {
    bot_id,
    bot_name,
    symbol,
    status,
    budget = {},
    strategy,
    portfolio,
  } = bot;

  const hasBudget =
    (budget.total_eur ?? 0) > 0 ||
    (budget.daily_limit_eur ?? 0) > 0 ||
    (budget.max_order_eur ?? 0) > 0;

  const handleEditBudget = () => {
    const form = {
      total_eur: budget.total_eur ?? 0,
      daily_limit_eur: budget.daily_limit_eur ?? 0,
      min_order_eur: budget.min_order_eur ?? 0,
      max_order_eur: budget.max_order_eur ?? 0,
    };

    openConfirm({
      title: `💰 Bot budget instellen – ${bot_name}`,
      description: (
        <div className="space-y-4 text-sm">
          <p className="text-[var(--text-muted)]">
            Dit budget begrenst hoeveel deze bot maximaal mag handelen.
            De strategy bepaalt het voorstel, dit budget is altijd leidend.
          </p>

          <div>
            <label className="block font-medium mb-1">
              Totaal budget (€)
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Maximale totale investering voor deze bot (0 = geen limiet)
            </p>
            <input
              type="number"
              defaultValue={form.total_eur}
              onChange={(e) =>
                (form.total_eur = Number(e.target.value))
              }
              className="input"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Daglimiet (€)
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Maximaal bedrag dat de bot per dag mag gebruiken
            </p>
            <input
              type="number"
              defaultValue={form.daily_limit_eur}
              onChange={(e) =>
                (form.daily_limit_eur = Number(e.target.value))
              }
              className="input"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Per trade (€)
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Minimum en maximum bedrag per order
            </p>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={form.min_order_eur}
                onChange={(e) =>
                  (form.min_order_eur = Number(e.target.value))
                }
                className="input"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={form.max_order_eur}
                onChange={(e) =>
                  (form.max_order_eur = Number(e.target.value))
                }
                className="input"
              />
            </div>
          </div>
        </div>
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        try {
          await onUpdateBudget(bot_id, form);
          showSnackbar("Bot budget bijgewerkt", "success");
        } catch (e) {
          showSnackbar("Opslaan van budget mislukt", "danger");
        }
      },
    });
  };

  return (
    <CardWrapper title={bot_name} subtitle={symbol}>
      <div className="space-y-5 text-sm">
        {/* STRATEGY CONTEXT */}
        {strategy && (
          <div>
            <div className="text-xs text-[var(--text-muted)]">
              Strategy
            </div>
            <div className="font-medium">
              {strategy.name}
              {strategy.amount_per_trade
                ? ` · €${strategy.amount_per_trade} / ${strategy.frequency}`
                : null}
            </div>
          </div>
        )}

        {/* BUDGET */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-[var(--text-muted)]">
              💰 Bot budget
            </div>
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

              <div className="flex justify-between items-center text-xs mt-2">
                <div className="space-y-0.5">
                  <div>
                    Beschikbaar: €
                    {budget.remaining_eur?.toFixed(0) ?? 0}
                  </div>
                  <div className="text-[var(--text-muted)]">
                    Daglimiet: €
                    {budget.daily_limit_eur?.toFixed(0) ??
                      "–"}
                    {budget.max_order_eur
                      ? ` · Per trade max €${budget.max_order_eur}`
                      : ""}
                  </div>
                </div>

                <button
                  onClick={handleEditBudget}
                  className="btn-secondary"
                >
                  ✏️ Budget wijzigen
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-[var(--text-muted)]">
                Geen budget ingesteld – deze bot kan nog
                geen trades uitvoeren.
              </div>
              <button
                onClick={handleEditBudget}
                className="btn-primary w-full"
              >
                💰 Budget instellen
              </button>
            </div>
          )}
        </div>

        {/* PORTFOLIO */}
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

        {/* STATUS */}
        <div className="pt-2 border-t text-xs flex justify-between">
          <span className="text-[var(--text-muted)]">
            Status
          </span>
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
    </CardWrapper>
  );
}
