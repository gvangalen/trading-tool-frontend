"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import BotForm from "@/components/bot/AddBotForm";
import BotBudgetForm from "@/components/bot/BotBudgetForm";
import BotPortfolioOverview from "@/components/bot/BotPortfolioOverview";
import PortfolioBalanceCard from "@/components/bot/PortfolioBalanceCard";

import GlobalTradePanel from "@/components/bot/GlobalTradePanel";
import { ActiveBotProvider, useActiveBot } from "@/app/providers/ActiveBotProvider";

/* =====================================================
   INNER PAGE (zodat we useActiveBot kunnen gebruiken)
===================================================== */
function BotPageInner() {
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});
  const budgetRef = useRef({});

  const { activeBot, setActiveBot } = useActiveBot();

  const [generatingBotId, setGeneratingBotId] = useState(null);
  const [executingBotId, setExecutingBotId] = useState(null);
  const [placingOrderBotId, setPlacingOrderBotId] = useState(null);

  const {
    configs: bots = [],
    today,
    history = [],
    portfolios = [],
    decisionsByBot = {},
    tradesByBot = {},
    loading,

    createBot,
    updateBot,
    deleteBot,
    updateBudgetForBot,

    generateDecisionForBot,
    executeBot,
    skipBot,

    saveTradePlanForDecision,
    createManualOrder,
  } = useBotData();

  const { strategies = [], loadStrategies } = useStrategyData();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =====================================================
     ✅ AUTO SELECT FIRST BOT (robuuste versie)
  ===================================================== */
  useEffect(() => {
    if (bots.length === 0) {
      setActiveBot(null);
      return;
    }

    if (!activeBot || !bots.find((b) => b.id === activeBot.id)) {
      setActiveBot(bots[0]);
    }
  }, [bots, activeBot, setActiveBot]);

  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
  };

  const aggregatedBotsForOverview = useMemo(() => {
    return (bots || []).map((bot) => {
      const p = (portfolios || []).find((x) => x.bot_id === bot.id);
      return {
        bot_id: bot.id,
        symbol: p?.symbol ?? bot?.symbol ?? "—",
        budget: p?.budget ?? {},
        stats: p?.stats ?? {},
      };
    });
  }, [bots, portfolios]);

  const totalPortfolioValueEur = useMemo(() => {
    return (portfolios || []).reduce((acc, p) => {
      const v = Number(p?.stats?.position_value_eur ?? 0);
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [portfolios]);

  const portfolio = history ?? [];

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

  const handleSaveTradePlan = async ({ bot_id, decision_id, draft }) => {
    if (!saveTradePlanForDecision) {
      showSnackbar("Save handler ontbreekt (hook)", "danger");
      return;
    }
    try {
      await saveTradePlanForDecision({ bot_id, decision_id, draft });
      showSnackbar("Trade plan opgeslagen", "success");
    } catch (e) {
      console.error(e);
      showSnackbar("Opslaan trade plan mislukt", "danger");
      throw e;
    }
  };

  const handleManualTrade = async (payload) => {
    if (!createManualOrder) {
      showSnackbar("createManualOrder ontbreekt (hook)", "danger");
      return;
    }
    try {
      setPlacingOrderBotId(payload?.bot_id ?? null);
      await createManualOrder(payload);
      showSnackbar("Paper trade geplaatst", "success");
    } catch (e) {
      console.error(e);
      showSnackbar("Paper trade mislukt", "danger");
      throw e;
    } finally {
      setPlacingOrderBotId(null);
    }
  };

  const handleExecuteBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);

      const decision = decisionsByBot?.[bot_id] ?? null;
      const decision_id = decision?.id ?? decision?.decision_id ?? null;

      if (!decision_id) {
        showSnackbar("Geen decision_id gevonden om uit te voeren", "danger");
        return;
      }

      await executeBot({ bot_id, decision_id });

      const bot = (bots || []).find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} uitgevoerd`, "success");
    } catch {
      showSnackbar("Uitvoeren mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  const handleSkipBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);
      await skipBot({ bot_id });

      const bot = (bots || []).find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} overgeslagen`, "info");
    } catch {
      showSnackbar("Overslaan mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  const handleAddBot = () => {
    formRef.current = {};
    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <BotForm strategies={strategies} onChange={(v) => (formRef.current = v)} />
      ),
      confirmText: "Bot toevoegen",
      onConfirm: async () => {
        if (!formRef.current?.name || !formRef.current?.strategy_id) {
          showSnackbar("Vul alle velden in", "danger");
          return;
        }
        await createBot(formRef.current);
        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 animate-fade-slide">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <Wallet className="icon icon-primary" />
            <h1 className="text-2xl font-semibold">Portfolio Management</h1>
          </div>

          <BotScores scores={dailyScores} loading={loading?.today} />

          <div className="space-y-6">
            {(bots || []).map((bot) => {
              const portfolio =
                (portfolios || []).find((p) => p.bot_id === bot.id) ?? null;

              const decision = decisionsByBot?.[bot.id] ?? null;
              const trades = tradesByBot?.[bot.id] ?? [];

              const isLoadingThisBot =
                generatingBotId === bot.id ||
                executingBotId === bot.id ||
                placingOrderBotId === bot.id;

              const isActive = activeBot?.id === bot.id;

              return (
                <div
                  key={bot.id}
                  onClick={(e) => {
                    if (
                      e.target.closest("button") ||
                      e.target.closest("input") ||
                      e.target.closest("select") ||
                      e.target.closest("textarea") ||
                      e.target.closest("[data-no-select]")
                    ) {
                      return;
                    }

                    setActiveBot(bot);
                  }}
                  className={`cursor-pointer transition ${
                    isActive
                      ? "ring-2 ring-[var(--primary)] rounded-2xl"
                      : ""
                  }`}
                >
                  <BotAgentCard
                    bot={bot}
                    decision={decision}
                    portfolio={portfolio}
                    trades={trades}
                    history={history ?? []}
                    loadingDecision={isLoadingThisBot}
                    onGenerate={() => handleGenerateDecision(bot)}
                    onExecute={handleExecuteBot}
                    onSkip={handleSkipBot}
                    onSaveTradePlan={handleSaveTradePlan}
                    onPlaceManualOrder={handleManualTrade}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT – sticky lager gezet */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <GlobalTradePanel />
        </div>
      </div>
    </div>
  );
}

  const handleOpenBotSettings = (type, bot) => {
    if (!bot) return;

    switch (type) {
      case "general":
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
            showSnackbar("Bot bijgewerkt", "success");
          },
        });
        break;

      case "portfolio": {
        const portfolio = (portfolios || []).find((p) => p.bot_id === bot.id);
        if (!portfolio) {
          showSnackbar("Geen portfolio gevonden voor bot", "danger");
          return;
        }

        budgetRef.current = {
          total_eur: portfolio.budget?.total_eur ?? 0,
          daily_limit_eur: portfolio.budget?.daily_limit_eur ?? 0,
          min_order_eur: portfolio.budget?.min_order_eur ?? 0,
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
            showSnackbar("Bot budget bijgewerkt", "success");
          },
        });
        break;
      }

      case "pause":
        openConfirm({
          title: "⏸️ Bot pauzeren",
          confirmText: "Pauzeren",
          onConfirm: async () => {
            await updateBot(bot.id, { is_active: false });
            showSnackbar("Bot gepauzeerd", "info");
          },
        });
        break;

      case "resume":
        openConfirm({
          title: "▶️ Bot hervatten",
          confirmText: "Hervatten",
          onConfirm: async () => {
            await updateBot(bot.id, { is_active: true });
            showSnackbar("Bot hervat", "success");
          },
        });
        break;

      case "delete":
        openConfirm({
          title: "🗑️ Bot verwijderen",
          confirmText: "Verwijderen",
          confirmVariant: "danger",
          onConfirm: async () => {
            await deleteBot(bot.id);
            showSnackbar("Bot verwijderd", "danger");
          },
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 animate-fade-slide">
      {/* 2-koloms layout: links content, rechts tradepanel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <Wallet className="icon icon-primary" />
            <h1 className="text-2xl font-semibold">Portfolio Management</h1>
          </div>

          <BotScores scores={dailyScores} loading={loading?.today} />

          <PortfolioBalanceCard
            title="Portfolio balance"
            defaultRange="1W"
            dataByRange={portfolioBalanceDataByRange}
          />

          <BotPortfolioOverview bots={aggregatedBotsForOverview} />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bots</h2>
            <button onClick={handleAddBot} className="btn-primary flex items-center gap-2">
              <Plus size={16} />
              Nieuwe bot
            </button>
          </div>

          <div className="space-y-6">
            {(bots || []).map((bot) => {
              const portfolio = (portfolios || []).find((p) => p.bot_id === bot.id) ?? null;
              const decision = decisionsByBot?.[bot.id] ?? null;
              const trades = tradesByBot?.[bot.id] ?? [];

              const isLoadingThisBot =
                generatingBotId === bot.id ||
                executingBotId === bot.id ||
                placingOrderBotId === bot.id;

              const isActive = activeBot?.id === bot.id;

              return (
             <div
               key={bot.id}
               onClick={(e) => {
                 if (
                   e.target.closest("button") ||
                   e.target.closest("input") ||
                   e.target.closest("select") ||
                   e.target.closest("textarea") ||
                   e.target.closest("[data-no-select]")
                 ) {
                   return;
                   }
                  
                   setActiveBot(bot);
                 }}
                 className={`cursor-pointer transition ${
                   isActive ? "ring-2 ring-[var(--primary)] rounded-2xl" : ""
                 }`}
               >
                  <BotAgentCard
                    bot={bot}
                    decision={decision}
                    portfolio={portfolio}
                    trades={trades}
                    history={history ?? []}
                    loadingDecision={isLoadingThisBot}
                    onGenerate={() => handleGenerateDecision(bot)}
                    onExecute={handleExecuteBot}
                    onSkip={handleSkipBot}
                    onOpenSettings={handleOpenBotSettings}
                    onSaveTradePlan={handleSaveTradePlan}
                    onPlaceManualOrder={handleManualTrade} // blijft voor compat / centrale panel gebruikt dit in jouw TradePanel
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: sticky global trade panel */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <GlobalTradePanel />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   EXPORT PAGE (met provider)
===================================================== */
export default function BotPage() {
  return (
    <ActiveBotProvider>
      <BotPageInner />
    </ActiveBotProvider>
  );
}
