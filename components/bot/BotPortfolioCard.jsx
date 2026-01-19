"use client";

import BotBudgetBar from "./BotBudgetBar";
import BotPnLBadge from "./BotPnLBadge";
import { useModal } from "@/components/modal/ModalProvider";
import { Info } from "lucide-react";

/**
 * BotPortfolioSection
 * --------------------------------------------------
 * Portfolio + Budget section van een bot
 *
 * ⚠️ GEEN card / GEEN wrapper
 * → bedoeld als section binnen BotAgentSurface
 *
 * Props:
 * - bot: bot portfolio object (uit /api/bot/portfolios)
 * - onUpdateBudget: (bot_id, payload) => Promise
 */
export default function BotPortfolioSection({ bot, onUpdateBudget }) {
  const { openConfirm, showSnackbar } = useModal();
  if (!bot) return null;

  const {
    bot_id,
    bot_name,
    symbol,
    status,
    budget = {},
    portfolio,
  } = bot;

  const hasBudget =
    (budget.total_eur ?? 0) > 0 ||
    (budget.daily_limit_eur ?? 0) > 0 ||
    (budget.max_order_eur ?? 0) > 0;

  /* =====================================================
     EDIT BUDGET
  ===================================================== */
  const handleEditBudget = () => {
    const form = {
      total_eur: budget.total_eur ?? 0,
      daily_limit_eur: budget.daily_limit_eur ?? 0,
      min_order_eur: budget.min_order_eur ?? 0,
      max_order_eur: budget.max_order_eur ?? 0,
    };

    openConfirm({
      title: `💰 Bot budget – ${bot_name}`,
      description: (
        <div className="space-y-4 text-sm">
          <p className="text-[var(--text-muted)]">
            Dit budget begrenst wat deze bot maximaal mag uitvoeren.
            De strategy doet voorstellen, maar dit budget is altijd leidend.
          </p>

          <Field
            label="Totaal budget (€)"
            hint="Maximale totale investering (0 = geen limiet)"
          >
            <input
              type="number"
              defaultValue={form.total_eur}
              onChange={(e) =>
                (form.total_eur = Number(e.target.value))
              }
              className="input"
            />
          </Field>

          <Field
            label="Daglimiet (€)"
            hint="Maximaal bedrag per dag"
          >
            <input
              type="number"
              defaultValue={form.daily_limit_eur}
              onChange={(e) =>
                (form.daily_limit_eur = Number(e.target.value))
              }
              className="input"
            />
          </Field>

          <Field
            label="Per trade (€)"
            hint="Minimum en maximum per order"
          >
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
          </Field>
        </div>
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        try {
          if (!onUpdateBudget) {
            throw new Error("onUpdateBudget niet gekoppeld");
          }

          await onUpdateBudget(bot_id, form);
          showSnackbar("Bot budget bijgewerkt", "success");
        } catch (err) {
          console.error("❌ Budget update fout:", err);
          showSnackbar("Budget opslaan mislukt", "danger");
        }
      },
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="space-y-5">
      {/* ===================== */}
      {/* BUDGET */}
      {/* ===================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            💰 Bot budget
            <span
              title="Zonder budget mag deze bot geen trades uitvoeren"
              className="cursor-help"
            >
              <Info size={13} className="icon-muted" />
            </span>
          </div>

          <button
            onClick={handleEditBudget}
            className="btn-outline text-xs px-3 py-1"
          >
            {hasBudget ? "Wijzigen" : "Instellen"}
          </button>
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
            Nog geen budget ingesteld
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
  );
}

/* =====================================================
   UI HELPERS
===================================================== */
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block font-medium mb-1">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-[var(--text-muted)] mb-1">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

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
