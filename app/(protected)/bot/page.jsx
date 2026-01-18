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
  const [generatingBotId, setGeneratingBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA (SINGLE SOURCE OF TRUTH)
  ===================================================== */
  const {
    configs: bots = [],
    today,
    history,
    portfolios = [],
    decisionsByBot,
    ordersByBot,
    loading,

    createBot,
    updateBot,
    deleteBot,

    updateBudgetForBot, // ✅ DIT WAS DE MISSENDE SCHAKEL

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
     ✅ DEFAULT ACTIVE BOT
  ===================================================== */
  useEffect(() => {
    if (!activeBotId && bots.length > 0) {
      setActiveBotId(bots[0].id);
    }
  }, [bots, activeBotId]);

  /* =====================================================
     🧠 ACTIVE CONTEXT
  ===================================================== */
  const activeDecision = decisionsByBot[activeBotId] ?? null;
  const activeOrder = ordersByBot[activeBotId] ?? null;

  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
  };

  /* =====================================================
     🔁 GENERATE DECISION (PER BOT)
  ===================================================== */
  const handleGenerateDecision = async (bot) => {
    try {
      setGeneratingBotId(bot.id);

      await generateDecisionForBot({
        bot_id: bot.id,
      });

      showSnackbar(`Decision gegenereerd voor ${bot.name}`, "success");
    } catch {
      showSnackbar(`Fout bij genereren decision voor ${bot.name}`, "danger");
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
      description: <>Weet je zeker dat <b>{bot.name}</b> weg mag?</>,
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteBot(bot.id);
        setActiveBotId(bots[0]?.id ?? null);
        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* =====================================================
     🧠 GLOBAL PORTFOLIO
  ===================================================== */
  const totalValue = portfolios.reduce(
    (a, b) => a + (b.portfolio?.cost_basis_eur ?? 0),
    0
  );

  const totalPnl = portfolios.reduce(
    (a, b) => a + (b.portfolio?.unrealized_pnl_eur ?? 0),
    0
  );

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 space-y-10 animate-fade-slide">
      {/* TITLE */}
      <div className="flex items-center gap-3">
        <Wallet className="icon icon-primary" />
        <h1 className="text-2xl font-semibold">Portfolio Management</h1>
      </div>

      {/* GLOBAL PORTFOLIO */}
      <div className="card-surface p-7 space-y-1">
        <div className="text-sm text-[var(--text-muted)]">
          Total Portfolio Value
        </div>

        <div className="text-4xl font-bold">
          €{totalValue.toFixed(2)}
        </div>

        <div className={totalPnl >= 0 ? "icon-success" : "icon-danger"}>
          {totalPnl >= 0 ? "+" : ""}
          €{totalPnl.toFixed(2)}
        </div>
      </div>

      {/* AGENT PORTFOLIOS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {portfolios.map((bot) => (
          <BotPortfolioCard
            key={bot.bot_id}
            bot={bot}
            onUpdateBudget={updateBudgetForBot} // ✅ HIER ZAT DE BUG
          />
        ))}
      </div>

      {/* BOT DECISIONS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <BotDecisionCard
            key={bot.id}
            bot={bot}
            decision={decisionsByBot[bot.id] ?? null}
            loading={generatingBotId === bot.id}
            onGenerate={() => handleGenerateDecision(bot)}
            onExecute={executeBot}
            onSkip={skipBot}
          />
        ))}
      </div>

      <BotScores scores={dailyScores} loading={loading.today} />

      <BotOrderPreview
        order={activeOrder}
        loading={loading.action}
        onExecute={
          activeDecision
            ? () =>
                executeBot({
                  bot_id: activeDecision.bot_id,
                  report_date: activeDecision.date,
                })
            : null
        }
        onSkip={
          activeDecision
            ? () =>
                skipBot({
                  bot_id: activeDecision.bot_id,
                  report_date: activeDecision.date,
                })
            : null
        }
      />

      {/* BOTS */}
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
          className="card-surface text-sm text-[var(--text-muted)]"
        >
          ➕ Nieuwe bot toevoegen
        </button>
      </div>

      <BotHistoryTable history={history} loading={loading.history} />
    </div>
  );
}
