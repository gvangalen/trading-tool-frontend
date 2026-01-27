"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import BotForm from "@/components/bot/AddBotForm";
import BotBudgetForm from "@/components/bot/BotBudgetForm";

/**
 * BotPage — TradeLayer 2.5 (FINAL / WORKING)
 *
 * ✔ Single source of truth
 * ✔ BotForm & BotBudgetForm = live sync
 * ✔ Opslaan ALLEEN via modal confirm
 * ✔ Pause / resume / delete werken + refreshen UI
 */
export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FEEDBACK
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});
  const budgetRef = useRef({});

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [generatingBotId, setGeneratingBotId] = useState(null);
  const [executingBotId, setExecutingBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA
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
    loadConfigs, // 🔑 CRUCIAAL
  } = useBotData();

  /* =====================================================
     🧠 STRATEGIES
  ===================================================== */
  const { strategies = [], loadStrategies } = useStrategyData();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =====================================================
     🌍 GLOBAL SCORES
  ===================================================== */
  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
  };

  /* =====================================================
     🔁 GENERATE DECISION
  ===================================================== */
  const handleGenerateDecision = async (bot) => {
    try {
      setGeneratingBotId(bot.id);
      await generateDecisionForBot({ bot_id: bot.id });
      await loadConfigs();
      showSnackbar(`Nieuw voorstel voor ${bot.name}`, "success");
    } catch {
      showSnackbar("Fout bij genereren voorstel", "danger");
    } finally {
      setGeneratingBotId(null);
    }
  };

  /* =====================================================
     ▶️ EXECUTE BOT
  ===================================================== */
  const handleExecuteBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);
      await executeBot({ bot_id });
      await loadConfigs();

      const bot = bots.find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} uitgevoerd`, "success");
    } catch {
      showSnackbar("Uitvoeren mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =====================================================
     ⏭️ SKIP BOT
  ===================================================== */
  const handleSkipBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);
      await skipBot({ bot_id });
      await loadConfigs();

      const bot = bots.find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} overgeslagen`, "info");
    } catch {
      showSnackbar("Overslaan mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =====================================================
     ➕ ADD BOT
  ===================================================== */
  const handleAddBot = () => {
    formRef.current = {};

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <BotForm
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Bot toevoegen",
      onConfirm: async () => {
        if (!formRef.current?.name || !formRef.current?.strategy_id) {
          showSnackbar("Vul alle velden in", "danger");
          return;
        }

        await createBot(formRef.current);
        await loadConfigs();
        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ⚙️ BOT SETTINGS ROUTER
  ===================================================== */
  const handleOpenBotSettings = (type, bot) => {
    if (!bot) return;

    const isAuto = bot.mode === "auto";

    if (isAuto && ["pause", "delete"].includes(type)) {
      showSnackbar(
        "Auto-bots kunnen niet gepauzeerd of verwijderd worden. Zet de bot eerst op manual.",
        "info"
      );
      return;
    }

    switch (type) {
      /* ---------- ALGEMEEN ---------- */
      case "general": {
        formRef.current = {};

        openConfirm({
          title: `⚙️ Bot instellingen – ${bot.name}`,
          description: (
            <BotForm
              initialData={bot}
              strategies={strategies}
              onChange={(v) => (formRef.current = v)}
            />
          ),
          confirmText: "Opslaan",
          onConfirm: async () => {
            await updateBot(bot.id, formRef.current);
            await loadConfigs();
            showSnackbar("Bot bijgewerkt", "success");
          },
        });
        break;
      }

      /* ---------- PORTFOLIO & BUDGET ---------- */
      case "portfolio": {
        const portfolio = portfolios.find((p) => p.bot_id === bot.id);
        if (!portfolio) return;

        budgetRef.current = {
          total_eur: portfolio.budget?.total_eur ?? 0,
          daily_limit_eur: portfolio.budget?.daily_limit_eur ?? 0,
          max_order_eur: portfolio.budget?.max_order_eur ?? 0,
        };

        openConfirm({
          title: `💰 Bot budget – ${bot.name}`,
          description: (
            <BotBudgetForm
              initialBudget={budgetRef.current}
              onChange={(v) => (budgetRef.current = v)}
            />
          ),
          confirmText: "Opslaan",
          onConfirm: async () => {
            await updateBudgetForBot(bot.id, budgetRef.current);
            await loadConfigs();
            showSnackbar("Bot budget bijgewerkt", "success");
          },
        });
        break;
      }

      /* ---------- PAUSE ---------- */
      case "pause":
        openConfirm({
          title: "⏸️ Bot pauzeren",
          description: (
            <p className="text-sm">
              De bot stopt met het genereren en uitvoeren van nieuwe beslissingen.
            </p>
          ),
          confirmText: "Pauzeren",
          onConfirm: async () => {
            await updateBot(bot.id, { status: "paused" });
            await loadConfigs();
            showSnackbar("Bot gepauzeerd", "info");
          },
        });
        break;

      /* ---------- RESUME ---------- */
      case "resume":
        openConfirm({
          title: "▶️ Bot hervatten",
          description: (
            <p className="text-sm">
              De bot wordt weer actief en doet opnieuw dagelijkse checks.
            </p>
          ),
          confirmText: "Hervatten",
          onConfirm: async () => {
            await updateBot(bot.id, { status: "active" });
            await loadConfigs();
            showSnackbar("Bot hervat", "success");
          },
        });
        break;

      /* ---------- DELETE ---------- */
      case "delete":
        openConfirm({
          title: "🗑️ Bot verwijderen",
          description: (
            <div className="space-y-2 text-sm">
              <p>
                Weet je zeker dat je bot <b>{bot.name}</b> wilt verwijderen?
              </p>
              <p className="text-[var(--text-muted)]">
                • Historie blijft bewaard<br />
                • Portfolio blijft intact<br />
                • Actie is niet ongedaan te maken
              </p>
            </div>
          ),
          confirmText: "Verwijderen",
          confirmVariant: "danger",
          onConfirm: async () => {
            await deleteBot(bot.id);
            await loadConfigs();
            showSnackbar("Bot verwijderd", "danger");
          },
        });
        break;

      default:
        break;
    }
  };

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 space-y-10 animate-fade-slide">
      <div className="flex items-center gap-3">
        <Wallet className="icon icon-primary" />
        <h1 className="text-2xl font-semibold">Portfolio Management</h1>
      </div>

      <BotScores scores={dailyScores} loading={loading.today} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bots</h2>
        <button
          onClick={handleAddBot}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nieuwe bot
        </button>
      </div>

      <div className="space-y-6">
        {bots.map((bot) => {
          const portfolio = portfolios.find((p) => p.bot_id === bot.id);
          const decision = decisionsByBot[bot.id];

          if (!decision) {
            return (
              <div
                key={bot.id}
                className="card-surface p-6 text-sm text-red-600"
              >
                ⚠️ Geen decision ontvangen voor bot <b>{bot.name}</b>
              </div>
            );
          }

          return (
            <BotAgentCard
              key={bot.id}
              bot={bot}
              decision={decision}
              portfolio={portfolio}
              history={history}
              loadingDecision={
                generatingBotId === bot.id ||
                executingBotId === bot.id
              }
              onGenerate={() => handleGenerateDecision(bot)}
              onExecute={handleExecuteBot}
              onSkip={handleSkipBot}
              onOpenSettings={handleOpenBotSettings}
            />
          );
        })}
      </div>
    </div>
  );
}
