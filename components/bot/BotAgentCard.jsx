"use client";

import { useState, useEffect, useRef } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";

import { useModal } from "@/components/modal/ModalProvider";

import {
  Brain,
  MoreVertical,
  Clock,
  Shield,
  Scale,
  Rocket,
  Bot,
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 2.5 (FINAL)
 * --------------------------------------------------
 * - Settings via 3-dot menu
 * - Portfolio & budget opent DIRECT bestaande budget modal
 * - Geen lege / tussen-modals
 * - Single source of truth
 */
export default function BotAgentCard({
  bot,
  decision,
  portfolio,
  history = [],
  loadingDecision = false,

  onGenerate,
  onExecute,
  onSkip,
  onUpdateBudget,
}) {
  if (!bot || !portfolio) return null;

  const { openConfirm, showSnackbar } = useModal();

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef(null);
  const isAuto = bot?.mode === "auto";

  /* =====================================================
     CLICK OUTSIDE — SETTINGS MENU
  ===================================================== */
  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  /* =====================================================
     RISK PROFILE
  ===================================================== */
  const riskProfile = (bot?.risk_profile ?? "balanced").toLowerCase();

  const riskConfig = {
    conservative: {
      label: "Conservative",
      icon: <Shield size={12} />,
      className: "bg-green-100 text-green-700 border-green-200",
    },
    balanced: {
      label: "Balanced",
      icon: <Scale size={12} />,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    aggressive: {
      label: "Aggressive",
      icon: <Rocket size={12} />,
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const risk = riskConfig[riskProfile] ?? riskConfig.balanced;

  /* =====================================================
     STATE LABEL
  ===================================================== */
  const stateLabel = () => {
    if (!decision) return "GEEN VOORSTEL";
    if (decision.status === "executed") {
      return decision.executed_by === "auto"
        ? "AUTOMATISCH UITGEVOERD"
        : "UITGEVOERD";
    }
    if (decision.status === "skipped") return "OVERGESLAGEN";
    return (decision.action || "—").toUpperCase();
  };

  /* =====================================================
     🔑 OPEN EXISTING BUDGET MODAL (SINGLE SOURCE)
  ===================================================== */
  const openBudgetModal = () => {
    const budget = portfolio.budget ?? {};

    const form = {
      total_eur: budget.total_eur ?? 0,
      daily_limit_eur: budget.daily_limit_eur ?? 0,
      min_order_eur: budget.min_order_eur ?? 0,
      max_order_eur: budget.max_order_eur ?? 0,
    };

    openConfirm({
      title: `💰 Bot budget – ${bot.name}`,
      description: (
        <div className="space-y-4 text-sm">
          <p className="text-[var(--text-muted)]">
            Dit budget begrenst wat deze bot maximaal mag uitvoeren.
            De strategy doet voorstellen, maar dit budget is altijd leidend.
          </p>

          <Field label="Totaal budget (€)" hint="0 = geen limiet">
            <input
              type="number"
              defaultValue={form.total_eur}
              onChange={(e) => (form.total_eur = Number(e.target.value))}
              className="input"
            />
          </Field>

          <Field label="Daglimiet (€)">
            <input
              type="number"
              defaultValue={form.daily_limit_eur}
              onChange={(e) =>
                (form.daily_limit_eur = Number(e.target.value))
              }
              className="input"
            />
          </Field>

          <Field label="Per trade (€)">
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
          await onUpdateBudget(portfolio.bot_id, form);
          showSnackbar("Bot budget bijgewerkt", "success");
        } catch {
          showSnackbar("Budget opslaan mislukt", "danger");
        }
      },
    });
  };

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6 relative">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="icon-primary">
            <Brain size={18} />
          </div>

          <div>
            <div className="font-semibold">{bot.name}</div>

            <div className="text-xs text-[var(--text-muted)]">
              {bot.symbol} · {bot.timeframe}
            </div>

            <div className="mt-2 text-xs">
              <span className="text-[var(--text-muted)]">Strategy:</span>{" "}
              <span className="font-medium">
                {bot.strategy?.name ?? "—"}
              </span>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${risk.className}`}
              >
                {risk.icon}
                Risk: {risk.label}
              </span>

              {isAuto && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700">
                  <Bot size={12} />
                  Auto mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SETTINGS MENU */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="icon-muted hover:icon-primary"
          >
            <MoreVertical size={18} />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 z-50">
              <BotSettingsMenu
                onOpen={(type) => {
                  setShowSettings(false);
                  if (type === "portfolio") {
                    openBudgetModal();
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
         STATE BAR
      ===================================================== */}
      <div className="bg-[var(--bg-soft)] rounded-xl px-4 py-3 text-sm">
        <span className="text-[var(--text-muted)]">Huidige status:</span>{" "}
        <span className="font-semibold">{stateLabel()}</span>
        {decision?.confidence && (
          <>
            {" "}
            · Confidence{" "}
            <span className="font-semibold uppercase">
              {decision.confidence}
            </span>
          </>
        )}
      </div>

      {/* =====================================================
         MAIN GRID
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BotDecisionCard
          bot={bot}
          decision={decision}
          order={decision?.order ?? null}
          loading={loadingDecision}
          isAuto={isAuto}
          onGenerate={onGenerate}
          onExecute={
            !isAuto ? () => onExecute?.({ bot_id: bot.id }) : undefined
          }
          onSkip={!isAuto ? () => onSkip?.({ bot_id: bot.id }) : undefined}
        />

        <BotPortfolioCard
          bot={portfolio}
          onUpdateBudget={onUpdateBudget}
        />
      </div>

      {/* =====================================================
         HISTORY
      ===================================================== */}
      <div className="pt-2 border-t">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2"
        >
          <Clock size={14} />
          {showHistory ? "Verberg history" : "Toon history"}
        </button>

        {showHistory && (
          <div className="pt-4">
            <BotHistoryTable
              history={history.filter((h) => h.bot_id === bot.id)}
              compact
            />
          </div>
        )}
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
      <label className="block font-medium mb-1">{label}</label>
      {hint && (
        <p className="text-xs text-[var(--text-muted)] mb-1">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
