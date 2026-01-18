"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import AddBotForm from "@/components/bot/AddBotForm";

/**
 * BotPage — Trading Bots v2.1
 *
 * Principes:
 * - 1 bot = 1 horizontale card
 * - Decision | Portfolio | History in tabs
 * - Bots onder elkaar (geen grid-chaos)
 * - Schaalbaar bij veel bots
 */
export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FORM
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [generatingBotId, setGeneratingBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA (single source of truth)
  ===================================================== */
  const {
    configs: bots = [],
    today,
    history = [],
    portfolios = [],
    decisionsByBot,
    ordersByBot,
    loading,

    createBot,
    updateBot,
    deleteBot,

    updateBudgetForBot,
    generateDecisionForBot,
    executeBot,
    skipBot,
  } = useBotData();

  /* =====================================================
     🧠 STRATEGIES
  ===================================================== */
  const { strategies = [], loadStrategies } = useStrategyData();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =====================================================
     🌍 GLOBAL CONTEXT
  ===================================================== */
  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
  };

  const activeOrder =
    Object.values(ordersByBot || {})[0] ?? null;

  /* =====================================================
     🔁 GENERATE DECISION (per bot)
  ===================================================== */
  const handleGenerateDecision = async (bot) => {
    try {
      setGeneratingBotId(bot.id);
      await generateDecisionForBot({ bot_id: bot.id });

      showSnackbar(
        `Decision gegenereerd voor ${bot.name}`,
        "success"
      );
    } catch {
      showSnackbar(
        `Fout bij genereren decision voor ${bot.name}`,
        "danger"
      );
    } finally {
      setGeneratingBotId(null);
    }
  };

  /* =====================================================
     ➕ ADD BOT
  ===================================================== */
  const handleAddBot = () => {
    formRef.current = {
      name: "",
      strategy_id: "",
      mode: "manual",
    };

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        if (
          !formRef.current.name ||
          !formRef.current.strategy_id
        ) {
          showSnackbar("Vul alle velden in", "danger");
          return;
        }

        await createBot(formRef.current);
        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     🧮 GLOBAL PORTFOLIO
  ===================================================== */
  const totalValue = portfolios.reduce(
    (sum, p) => sum + (p.portfolio?.cost_basis_eur ?? 0),
    0
  );

  const totalPnl = portfolios.reduce(
    (sum, p) =>
      sum + (p.portfolio?.unrealized_pnl_eur ?? 0),
    0
  );

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 space-y-10 animate-fade-slide">
      {/* =====================================================
         TITLE
      ===================================================== */}
      <div className="flex items-center gap-3">
        <Wallet className="icon icon-primary" />
        <h1 className="text-2xl font-semibold">
          Portfolio Management
        </h1>
      </div>

      {/* =====================================================
         GLOBAL PORTFOLIO SUMMARY
      ===================================================== */}
      <div className="card-surface p-7 space-y-1">
        <div className="text-sm text-[var(--text-muted)]">
          Total Portfolio Value
        </div>

        <div className="text-4xl font-bold">
          €{totalValue.toFixed(2)}
        </div>

        <div
          className={
            totalPnl >= 0 ? "icon-success" : "icon-danger"
          }
        >
          {totalPnl >= 0 ? "+" : ""}
          €{totalPnl.toFixed(2)}
        </div>
      </div>

      {/* =====================================================
         BOT AGENTS — HORIZONTAAL (🔥 BELANGRIJK)
      ===================================================== */}
      <div className="space-y-6">
        {bots.map((bot) => {
          const portfolio = portfolios.find(
            (p) => p.bot_id === bot.id
          );

          return (
            <BotAgentCard
              key={bot.id}
              bot={bot}
              decision={decisionsByBot[bot.id] ?? null}
              portfolio={portfolio}
              history={history}
              loadingDecision={generatingBotId === bot.id}
              onGenerate={() =>
                handleGenerateDecision(bot)
              }
              onExecute={executeBot}
              onSkip={skipBot}
              onUpdateBudget={updateBudgetForBot}
            />
          );
        })}

        {/* ➕ ADD BOT ROW */}
        <button
          onClick={handleAddBot}
          className="card-surface text-sm text-[var(--text-muted)] flex items-center justify-center py-6"
        >
          ➕ Nieuwe bot toevoegen
        </button>
      </div>

      {/* =====================================================
         SCORES (GLOBAL CONTEXT)
      ===================================================== */}
      <BotScores
        scores={dailyScores}
        loading={loading.today}
      />

      {/* =====================================================
         ORDER PREVIEW (OPTIONEEL / GLOBAL)
      ===================================================== */}
      <BotOrderPreview
        order={activeOrder}
        loading={loading.action}
        onExecute={
          activeOrder
            ? () =>
                executeBot({
                  bot_id: activeOrder.bot_id,
                  report_date: activeOrder.date,
                })
            : null
        }
        onSkip={
          activeOrder
            ? () =>
                skipBot({
                  bot_id: activeOrder.bot_id,
                  report_date: activeOrder.date,
                })
            : null
        }
      />
    </div>
  );
}
