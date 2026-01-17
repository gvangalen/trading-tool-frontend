"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotCard from "@/components/bot/BotCard";
import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import AddBotForm from "@/components/bot/AddBotForm";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";

export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FORM
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [activeBotId, setActiveBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA
  ===================================================== */
  const {
    configs: bots = [],
    today,
    history,
    portfolios = [],
    loading,
    createBot,
    updateBot,
    deleteBot,
    runBotToday,
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
     ✅ DEFAULT ACTIVE BOT
  ===================================================== */
  useEffect(() => {
    if (!activeBotId && bots.length > 0) {
      setActiveBotId(bots[0].id);
    }
  }, [bots, activeBotId]);

  /* =====================================================
     🧠 ACTIVE BOT CONTEXT
  ===================================================== */
  const activeDecision =
    today?.decisions?.find(
      (d) => d.bot_id === activeBotId
    ) ?? null;

  const activeOrder =
    today?.orders?.find(
      (o) => o.bot_id === activeBotId
    ) ?? null;

  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
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
        if (!formRef.current.name || !formRef.current.strategy_id) {
          showSnackbar("Vul alle velden in", "danger");
          return;
        }

        const res = await createBot(formRef.current);
        if (res?.id) setActiveBotId(res.id);

        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ✏️ EDIT BOT
  ===================================================== */
  const handleEditBot = (botId) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    formRef.current = {
      name: bot.name,
      strategy_id: bot.strategy?.id ?? "",
      mode: bot.mode,
    };

    openConfirm({
      title: "✏️ Bot bewerken",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        await updateBot(bot.id, formRef.current);
        showSnackbar("Bot aangepast", "success");
      },
    });
  };

  /* =====================================================
     🗑 DELETE BOT
  ===================================================== */
  const handleDeleteBot = (botId) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    openConfirm({
      title: "🗑 Bot verwijderen",
      tone: "danger",
      description: (
        <>
          Weet je zeker dat <b>{bot.name}</b> weg mag?
        </>
      ),
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteBot(bot.id);
        setActiveBotId(bots[0]?.id ?? null);
        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* =====================================================
     ▶️ RUN DECISION (PER ACTIVE BOT)
  ===================================================== */
  const handleRunBotToday = () => {
    if (!activeBotId) return;
    runBotToday(activeBotId);
  };

  /* =====================================================
     🧠 GLOBAL PORTFOLIO
  ===================================================== */
  const totalValue = portfolios.reduce(
    (a, b) => a + (b.value ?? 0),
    0
  );

  const totalPnl = portfolios.reduce(
    (a, b) => a + (b.pnl ?? 0),
    0
  );

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 space-y-10 animate-fade-slide">
      {/* ===== PAGE TITLE ===== */}
      <div className="flex items-center gap-3">
        <Wallet className="icon icon-primary" />
        <h1 className="text-2xl font-semibold text-[var(--text-dark)]">
          Portfolio Management
        </h1>
      </div>

      {/* ===== GLOBAL PORTFOLIO ===== */}
      <div className="card-surface p-7 space-y-1">
        <div className="text-sm text-[var(--text-muted)]">
          Total Portfolio Value
        </div>

        <div className="text-4xl font-bold text-[var(--text-dark)]">
          €{totalValue.toFixed(2)}
        </div>

        <div
          className={`text-sm ${
            totalPnl >= 0 ? "icon-success" : "icon-danger"
          }`}
        >
          {totalPnl >= 0 ? "+" : ""}
          €{totalPnl.toFixed(2)}
        </div>
      </div>

      {/* ===== AGENT PORTFOLIOS ===== */}
      {portfolios.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-dark)]">
            Agent Portfolios
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {portfolios.map((bot) => (
              <BotPortfolioCard
                key={bot.bot_id}
                bot={bot}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== BOT DECISION (ACTIVE BOT ONLY) ===== */}
      <BotDecisionCard
        decision={activeDecision}
        loading={loading.today}
        onGenerate={handleRunBotToday}
        onExecute={executeBot}
        onSkip={skipBot}
      />

      {/* ===== CONTEXT SCORES ===== */}
      <BotScores
        scores={dailyScores}
        loading={loading.today}
      />

      {/* ===== ORDER PREVIEW (ACTIVE BOT) ===== */}
      <BotOrderPreview
        order={activeOrder}
        loading={loading.action}
        onExecute={
          activeDecision
            ? () =>
                executeBot({
                  bot_id: activeDecision.bot_id,
                  report_date: activeDecision.report_date,
                })
            : null
        }
        onSkip={
          activeDecision
            ? () =>
                skipBot({
                  bot_id: activeDecision.bot_id,
                  report_date: activeDecision.report_date,
                })
            : null
        }
      />

      {/* ===== BOTS & STRATEGIES ===== */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-dark)]">
          Bots & Strategies
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              isActive={bot.id === activeBotId}
              onSelect={setActiveBotId}
              onEdit={handleEditBot}
              onDelete={handleDeleteBot}
            />
          ))}

          <button
            onClick={handleAddBot}
            className="
              card-surface
              flex items-center justify-center
              text-sm text-[var(--text-muted)]
              border-dashed
              hover:border-[var(--primary)]
            "
          >
            ➕ Nieuwe bot toevoegen
          </button>
        </div>
      </div>

      {/* ===== HISTORY ===== */}
      <BotHistoryTable
        history={history}
        loading={loading.history}
      />
    </div>
  );
}
