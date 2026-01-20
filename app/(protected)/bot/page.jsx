"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import AddBotForm from "@/components/bot/AddBotForm";

/**
 * BotPage — Trading Bots v2.2 (FINAL)
 *
 * Layout-principes:
 * - Scores = context (bovenaan)
 * - Bots = actie
 * - Nieuwe bot = beheer (header)
 * - Geen globale order preview
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
    decisionsByBot = {},
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

  /* =====================================================
     🔁 GENERATE DECISION (per bot)
  ===================================================== */
  const handleGenerateDecision = async (bot) => {
    try {
      setGeneratingBotId(bot.id);

      await generateDecisionForBot({
        bot_id: bot.id,
      });

      showSnackbar(
        `Voorstel gegenereerd voor ${bot.name}`,
        "success"
      );
    } catch {
      showSnackbar(
        `Fout bij genereren voorstel voor ${bot.name}`,
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
     🧮 GLOBAL PORTFOLIO SUMMARY
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
         SCORES — CONTEXT
      ===================================================== */}
      <BotScores
        scores={dailyScores}
        loading={loading.today}
      />

      {/* =====================================================
         GLOBAL PORTFOLIO SUMMARY
      ===================================================== */}
      <div className="card-surface p-7 space-y-1">
        <div className="text-sm text-[var(--text-muted)]">
          Totale portfolio waarde
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
         BOTS HEADER
      ===================================================== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Bots
        </h2>

        <button
          onClick={handleAddBot}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nieuwe bot
        </button>
      </div>

      {/* =====================================================
         BOT AGENTS — PER BOT
      ===================================================== */}
      <div className="space-y-6">
        {bots.length === 0 && (
          <div className="card-surface p-6 text-sm text-[var(--text-muted)]">
            Nog geen bots aangemaakt.
          </div>
        )}

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
      </div>
    </div>
  );
}
