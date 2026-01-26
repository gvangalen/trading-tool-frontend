"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import AddBotForm from "@/components/bot/AddBotForm";
import BotPortfolioSection from "@/components/bot/BotPortfolioCard";

/**
 * BotPage — Trading Bots v2.5 (FINAL)
 *
 * ✔ Backend = single source of truth
 * ✔ Settings via 3-dot menu
 * ✔ Modals hergebruiken bestaande flows
 * ✔ Pause / resume / delete inclusief safety checks
 */
export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FEEDBACK
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});

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

      const bot = bots.find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} overgeslagen`, "success");
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
    formRef.current = {
      name: "",
      strategy_id: "",
      mode: "manual",
      risk_profile: "balanced",
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

        await createBot(formRef.current);
        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ⚙️ BOT SETTINGS ROUTER (DEFINITIEF)
  ===================================================== */
  const handleOpenBotSettings = (type, bot) => {
    if (!bot) return;

    const isAuto = bot.mode === "auto";

    /* ================= SAFETY ================= */
    if (isAuto && ["pause", "delete"].includes(type)) {
      showSnackbar(
        "Auto-bots kunnen niet gepauzeerd of verwijderd worden. Zet de bot eerst op manual.",
        "warning"
      );
      return;
    }

    switch (type) {
      /* ============ ALGEMEEN ============ */
      case "general": {
        formRef.current = { ...bot };

        openConfirm({
          title: `⚙️ Bot instellingen – ${bot.name}`,
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
            showSnackbar("Bot bijgewerkt", "success");
          },
        });
        break;
      }

      /* ============ PORTFOLIO ============ */
      case "portfolio": {
        const portfolio = portfolios.find((p) => p.bot_id === bot.id);
        if (!portfolio) return;

        openConfirm({
          title: `💰 Bot budget – ${bot.name}`,
          description: (
            <BotPortfolioSection
              bot={portfolio}
              onUpdateBudget={updateBudgetForBot}
            />
          ),
          hideConfirm: true,
          hideCancel: true,
        });
        break;
      }

      /* ============ PAUSE ============ */
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
            showSnackbar("Bot gepauzeerd", "success");
          },
        });
        break;

      /* ============ RESUME ============ */
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
            showSnackbar("Bot hervat", "success");
          },
        });
        break;

      /* ============ DELETE ============ */
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
            showSnackbar("Bot verwijderd", "success");
          },
        });
        break;

      default:
        break;
    }
  };

  /* =====================================================
     🧮 GLOBAL PORTFOLIO
  ===================================================== */
  const totalValue = portfolios.reduce(
    (sum, p) => sum + (p.portfolio?.cost_basis_eur ?? 0),
    0
  );

  const totalPnl = portfolios.reduce(
    (sum, p) => sum + (p.portfolio?.unrealized_pnl_eur ?? 0),
    0
  );

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

      <div className="card-surface p-7 space-y-1">
        <div className="text-sm text-[var(--text-muted)]">
          Totale portfolio waarde
        </div>
        <div className="text-4xl font-bold">€{totalValue.toFixed(2)}</div>
        <div className={totalPnl >= 0 ? "icon-success" : "icon-danger"}>
          {totalPnl >= 0 ? "+" : ""}€{totalPnl.toFixed(2)}
        </div>
      </div>

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
              onUpdateBudget={updateBudgetForBot}
              onOpenSettings={handleOpenBotSettings}
            />
          );
        })}
      </div>
    </div>
  );
}
