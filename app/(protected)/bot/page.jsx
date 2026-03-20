"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import { useMarketIntelligence } from "@/hooks/useMarketIntelligence";
import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import BotForm from "@/components/bot/AddBotForm";
import BotBudgetForm from "@/components/bot/BotBudgetForm";
import BotPortfolioOverview from "@/components/bot/BotPortfolioOverview";
import PortfolioBalanceCard from "@/components/bot/PortfolioBalanceCard";
import GlobalTradePanel from "@/components/bot/GlobalTradePanel";

import {
  ActiveBotProvider,
  useActiveBot,
} from "@/app/providers/ActiveBotProvider";

/* =====================================================
   INNER PAGE
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

    generateDecisionForBot,
    executeBotDecision, 
    skipBot, 

    saveTradePlanForDecision,
    createManualOrder,
  } = useBotData();

  const { strategies = [], loadStrategies } = useStrategyData();

  const {
    data: marketIntelligence,
    loading: loadingMarketIntelligence,
  } = useMarketIntelligence();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =========================
     AUTO SELECT FIRST BOT
  ========================= */

  useEffect(() => {
    if (bots.length === 0) {
      setActiveBot(null);
      return;
    }

    if (!activeBot || !bots.find((b) => b.id === activeBot.id)) {
      setActiveBot(bots[0]);
    }
  }, [bots, activeBot, setActiveBot]);

  /* =========================
     DAILY SCORES
  ========================= */

  const dailyScores =
    today?.daily_scores ??
    today?.scores ?? {
      macro: 10,
      technical: 10,
      market: 10,
      setup: 10,
    };

  /* =========================
     AGGREGATED PORTFOLIO
  ========================= */

  const aggregatedBotsForOverview = useMemo(() => {
    return bots.map((bot) => {
      const p = portfolios.find((x) => x.bot_id === bot.id);

      return {
        bot_id: bot.id,
        symbol: p?.symbol ?? bot?.symbol ?? "—",
        budget: p?.budget ?? {},
        stats: p?.stats ?? {},
      };
    });
  }, [bots, portfolios]);

  const totalPortfolioValueEur = useMemo(() => {
    return portfolios.reduce((acc, p) => {
      const v = Number(p?.stats?.position_value_eur ?? 0);
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [portfolios]);

  /* =========================
     PORTFOLIO BALANCE
  ========================= */

  const portfolioBalanceDataByRange = useMemo(() => {
    const byRange =
      today?.portfolio_balance_by_range ||
      today?.portfolio_balance_history_by_range ||
      null;

    if (byRange && typeof byRange === "object") {
      const normalizeSeries = (series) =>
        (Array.isArray(series) ? series : [])
          .map((p) => ({
            ts: p?.ts || p?.timestamp || p?.date || null,
            value_eur: Number(
              p?.value_eur ??
                p?.value ??
                p?.balance_eur ??
                p?.portfolio_value_eur ??
                0
            ),
          }))
          .filter((p) => p.ts && Number.isFinite(p.value_eur));

      return {
        "1D": normalizeSeries(byRange["1D"]),
        "1W": normalizeSeries(byRange["1W"]),
        "1M": normalizeSeries(byRange["1M"]),
        "1Y": normalizeSeries(byRange["1Y"]),
        ALL: normalizeSeries(byRange["ALL"] || byRange["all"]),
      };
    }

    const now = new Date().toISOString();

    const single = [{ ts: now, value_eur: totalPortfolioValueEur }];

    return {
      "1D": single,
      "1W": single,
      "1M": single,
      "1Y": single,
      ALL: single,
    };
  }, [today, totalPortfolioValueEur]);

  /* =========================
     HANDLERS
  ========================= */

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
    try {
      await saveTradePlanForDecision({ bot_id, decision_id, draft });

      showSnackbar("Trade plan opgeslagen", "success");
    } catch (e) {
      showSnackbar("Opslaan trade plan mislukt", "danger");
      throw e;
    }
  };

  const handleManualTrade = async (payload) => {
    try {
      setPlacingOrderBotId(payload?.bot_id ?? null);

      await createManualOrder(payload);

      showSnackbar("Paper trade geplaatst", "success");
    } catch (e) {
      showSnackbar("Paper trade mislukt", "danger");
      throw e;
    } finally {
      setPlacingOrderBotId(null);
    }
  };


  /* =========================
     EXECUTE BOT
  ========================= */
  const handleExecuteBot = async (bot) => {
    try {
      if (!bot?.id) {
        showSnackbar("Geen bot_id", "danger");
        return;
      }
  
      setExecutingBotId(bot.id);
  
      const decision = decisionsByBot?.[bot.id];
      const decision_id = decision?.id ?? decision?.decision_id;
  
      if (!decision_id) {
        showSnackbar("Geen decision_id gevonden", "danger");
        return;
      }
  
      await executeBotDecision({
        bot_id: bot.id,
        decision_id,
      });
  
      showSnackbar("Bot uitgevoerd", "success");
  
    } catch (e) {
      console.error(e);
      showSnackbar("Uitvoeren mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =========================
     SKIP BOT
  ========================= */
  const handleSkipBot = async (bot) => {
    try {
      if (!bot?.id) {
        showSnackbar("Geen bot_id", "danger");
        return;
      }
  
      setExecutingBotId(bot.id);
  
      await skipBot({
        bot_id: bot.id,
      });
  
      showSnackbar("Bot overgeslagen", "info");
  
    } catch (e) {
      console.error(e);
      showSnackbar("Overslaan mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =========================
     ADD BOT
  ========================= */
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

        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =========================
     SETTINGS
  ========================= */
  const handleOpenBotSettings = async (type, bot) => {
    if (!bot) return;

    if (type === "general") {
      formRef.current = bot;

      openConfirm({
        title: "⚙️ Bot instellingen",
        description: (
          <BotForm
            strategies={strategies}
            initialValues={bot}
            onChange={(v) => (formRef.current = v)}
          />
        ),
        confirmText: "Opslaan",
        onConfirm: async () => {
          await updateBot(bot.id, formRef.current);

          showSnackbar("Bot bijgewerkt", "success");
        },
      });

      return;
    }

    if (type === "portfolio") {
      const portfolio = portfolios.find((p) => p.bot_id === bot.id);

      budgetRef.current = {
        total_eur: portfolio?.budget?.total_eur ?? 0,
        daily_limit_eur: portfolio?.budget?.daily_limit_eur ?? 0,
        max_order_eur: portfolio?.budget?.max_order_eur ?? 0,
        max_asset_exposure_pct:
          portfolio?.budget?.max_asset_exposure_pct ?? 100,
      };

      openConfirm({
        title: "💰 Portfolio & budget",
        description: (
          <BotBudgetForm
            initialBudget={budgetRef.current}
            onChange={(v) => (budgetRef.current = v)}
          />
        ),
        confirmText: "Opslaan",
        onConfirm: async () => {
          await updateBot(bot.id, {
            budget_total_eur: budgetRef.current.total_eur,
            budget_daily_limit_eur: budgetRef.current.daily_limit_eur,
            budget_max_order_eur: budgetRef.current.max_order_eur,
            max_asset_exposure_pct: budgetRef.current.max_asset_exposure_pct,
          });

          showSnackbar("Budget bijgewerkt", "success");
        },
      });

      return;
    }

    if (type === "pause") {
      await updateBot(bot.id, { is_active: false });
      showSnackbar("Bot gepauzeerd", "info");
      return;
    }

    if (type === "resume") {
      await updateBot(bot.id, { is_active: true });
      showSnackbar("Bot hervat", "success");
      return;
    }

    if (type === "delete") {
      openConfirm({
        title: "🗑️ Bot verwijderen",
        tone: "danger",
        confirmText: "Verwijderen",
        onConfirm: async () => {
          await deleteBot(bot.id);

          showSnackbar("Bot verwijderd", "danger");
        },
      });
    }
  };

  /* =========================
   RENDER
========================= */

return (
  <div className="bg-[var(--surface-1)] pt-6 pb-10 animate-fade-slide">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

      {/* LEFT */}
      <div className="space-y-10">

        <div className="flex items-center gap-3">
          <Wallet />
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

            const portfolio = portfolios.find(
              (p) => p.bot_id === bot.id
            );

            const decision = decisionsByBot?.[bot.id];

            const order = (today?.orders || []).find(
              (o) => o.bot_id === bot.id
            );

            const trades = tradesByBot?.[bot.id] ?? [];

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
                  order={order}
                  marketIntelligence={marketIntelligence}
                  loadingMarketIntelligence={loadingMarketIntelligence}
                  portfolio={portfolio}
                  trades={trades}
                  history={history}
                  loadingDecision={generatingBotId === bot.id}

                  onGenerate={() => handleGenerateDecision(bot)}
                  onExecute={() => handleExecuteBot(bot)}
                  onSkip={() => handleSkipBot(bot)}

                  onOpenSettings={handleOpenBotSettings}
                  onSaveTradePlan={handleSaveTradePlan}
                  onPlaceManualOrder={handleManualTrade}
                />
              </div>
            );
          })}
        </div>

      </div> {/* END LEFT */}

      {/* RIGHT */}
      <div className="lg:sticky lg:top-24 space-y-4">
        <GlobalTradePanel />
      </div>

    </div> {/* END GRID */}
  </div>
);

/* =========================
   END COMPONENT
========================= */
}

/* =====================================================
   EXPORT
===================================================== */

export default function BotPage() {
  return (
    <ActiveBotProvider>
      <BotPageInner />
    </ActiveBotProvider>
  );
}
