// components/bot/BotPortfolioCard.jsx
"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";
import { useModal } from "@/components/modal/ModalProvider";

export default function BotPortfolioCard({ bot }) {
  const { openConfirm, showSnackbar } = useModal();
  if (!bot) return null;

  const {
    bot_name,
    symbol,
    status,
    budget,
    strategy,
    portfolio,
  } = bot;

  const handleEditBudget = () => {
    const form = {
      total_eur: budget.total_eur,
      daily_limit_eur: budget.daily_limit_eur,
      max_order_eur: budget.max_order_eur,
    };

    openConfirm({
      title: `💰 Budget instellen – ${bot_name}`,
      description: (
        <div className="space-y-3 text-sm">
          <input
            type="number"
            defaultValue={form.total_eur}
            onChange={(e) => (form.total_eur = +e.target.value)}
            className="input"
            placeholder="Totaal budget (€)"
          />
          <input
            type="number"
            defaultValue={form.daily_limit_eur}
            onChange={(e) => (form.daily_limit_eur = +e.target.value)}
            className="input"
            placeholder="Daglimiet (€)"
          />
          <input
            type="number"
            defaultValue={form.max_order_eur}
            onChange={(e) => (form.max_order_eur = +e.target.value)}
            className="input"
            placeholder="Max per trade (€)"
          />
        </div>
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        await bot.onUpdateBudget(form);
        showSnackbar("Bot budget bijgewerkt", "success");
      },
    });
  };

  return (
    <CardWrapper title={bot_name} subtitle={symbol}>
      <div className="space-y-4 text-sm">

        {/* STRATEGY CONTEXT */}
        <div>
          <div className="text-xs text-[var(--text-muted)]">
            Strategy
          </div>
          <div className="font-medium">
            {strategy.name} · €{strategy.amount_per_trade} / {strategy.frequency}
          </div>
        </div>

        {/* BUDGET */}
        <div>
          <BotBudgetBar
            label="Budget"
            total={budget.total_eur}
            spent={budget.total_eur - budget.remaining_eur}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>Remaining €{budget.remaining_eur}</span>
            <button
              onClick={handleEditBudget}
              className="underline text-[var(--primary)]"
            >
              Aanpassen
            </button>
          </div>
        </div>

        {/* PORTFOLIO */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Holdings</div>
            <div className="font-medium">
              {portfolio.units.toFixed(4)} {symbol}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">Avg entry</div>
            <div className="font-medium">
              €{portfolio.avg_entry.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">Cost basis</div>
            <div className="font-medium">
              €{portfolio.cost_basis_eur.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-muted)]">PnL</div>
            <BotPnLBadge
              pnlEur={portfolio.unrealized_pnl_eur}
              pnlPct={portfolio.unrealized_pnl_pct}
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="pt-2 border-t text-xs flex justify-between">
          <span className="text-[var(--text-muted)]">Status</span>
          <span className={status === "active" ? "icon-success" : ""}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
